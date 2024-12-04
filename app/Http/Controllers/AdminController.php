<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        try {
            // Get the TermID from the configuration table
            $termIDResult = DB::connection(session()->get('db'))->select("SELECT Value FROM dbo.ES_Configuration WHERE [Key] = 'TermID' AND Section = 'Registration'");
            
            if (empty($termIDResult)) {
                throw new \Exception('TermID not found in the configuration.');
            }
    
            $termID = $termIDResult[0]->Value;  

            $query = "SELECT 
                            EAT.TermID,
                            CONCAT(EAT.AcademicYear, ' ', EAT.SchoolTerm) AS TermName, 
                            CONVERT(VARCHAR, EATC.StartEnrollment, 23) AS StartEnrollment, 
                            CONVERT(VARCHAR, EATC.EndEnrollment, 23) AS EndEnrollment,
                            EAT.IsPerCollegeEnrollment
                        FROM 
                            ES_AYTerm EAT
                        JOIN 
                            ES_AYTermConfig EATC
                            ON EAT.TermID = EATC.TermID
                        WHERE 
                            EAT.TermID = ?";
            $termInfo = DB::connection(session()->get('db'))->select($query, [$termID]);
    
            if (empty($termInfo)) {
                throw new \Exception('No term information found for TermID: ' . $termID);
            }
    
            return Inertia::render('Enrollment/adminpage', [
                'terminfo' => $termInfo[0]
            ]);
            
        } catch (\Exception $e) {

            \Log::error('Error fetching term information: ' . $e->getMessage());
    
            // Optionally, you can show a generic error page or message to the user
            return Inertia::render('Enrollment/adminpage', [
                'error' => 'An error occurred while fetching the term information. Please try again later.'
            ]);
        }
    }

    public function College(){
        $query="Select CollegeID, CollegeName From ES_Colleges Where CampusID = ?";
        $colleges = DB::connection(session()->get('db'))->select($query,[session()->get('campusID')]);
        return $colleges;
    }

    public function Program(Request $request){
        $query="Select ProgID, ProgName From ES_Programs Where CampusID = ? and CollegeID = ?";
        $programs = DB::connection(session()->get('db'))->select($query,[session()->get('campusID'), $request->collegeId]);
        return $programs;
    }

    public function CollegeEnrollment(Request $request){
        $query = "SELECT 
                CONVERT(VARCHAR, StartEnrollment, 23) AS StartEnrollment, 
                CONVERT(VARCHAR, EndEnrollment, 23) AS EndEnrollment
            FROM 
                ES_College_Enrollment

            WHERE 
                TermID = ? AND CampusID =? AND CollegeID = ?";
        $response = DB::connection(session()->get('db'))->select($query,[$request->termID,session()->get('campusID'), $request->collegeId]);

        return $response;
    }

    public function SaveEnrollmentSetting(Request $request){

        if($request->data['CollegeID'] == 0){
            $query = "UPDATE ES_AYTerm
                        SET 
                            IsPerCollegeEnrollment= ?
                        WHERE TermID = ?";
            $data = [
                $request->data['isHidden']==true? 1 : 0,
                $request->data['TermID']
            ];
            DB::connection(session()->get('db'))->statement($query,$data);

            if(!$request->data['isHidden']){
                $query2 = "UPDATE ES_AYTermConfig
                            SET 
                                StartEnrollment = '".$request->data['StartEnrollment']."',
                                EndEnrollment = '".$request->data['EndEnrollment']."'
                            WHERE TermID = ?";
                $data2 = [
                    $request->data['TermID'],
                ];
                DB::connection(session()->get('db'))->statement($query2,$data2);
            }
        }else{

            $data = [
                'TermID' => $request->data['TermID'],
                'CampusID' => session()->get('campusID'),
                'CollegeID' => $request->data['CollegeID'],
                'ProgramID' => $request->data['ProgramID'],
                'StartEnrollment' => $request->data['StartEnrollment'],
                'EndEnrollment' => $request->data['EndEnrollment'], // Corrected the typo: 'EndEnrollmet' -> 'EndEnrollment'
            ];

            $condition = [
                'TermID' => $request->data['TermID'],
                'CollegeID' => $request->data['CollegeID'],
            ];
    
            DB::connection(session()->get('db'))->table('ES_College_Enrollment')
                ->updateOrInsert($condition, $data);
        }
        return response()->json(['message' => 'success']);
    }
}
