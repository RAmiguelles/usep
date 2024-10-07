<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use App\Models\Subject;
use App\Models\Registration;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;    
use Exception;
use Illuminate\Support\Carbon;

use function Pest\Laravel\json;

class StudentController extends Controller
{
    public function show()
    { 
        try {
            // Prepare data for the view
            $data = [
                'user' => session()->get('idNumber'),
                'token' => session()->get('token'),
                'campus' => session()->get('campusID'),
            ];
            $headers = [
                'Authorization' =>$data['token'],
                'Content-Type' => 'application/json',
            ];

            $profileResponse = Http::withHeaders($headers)->get("https://api.usep.edu.ph/student/getProfile/{$data['user']}/{$data['campus']}");

            if ($profileResponse->successful()) {
                $profileData = $profileResponse->json();
                $profile = $profileData;
                $cID = DB::connection(session()->get('db'))->select("select IndexID from ES_Curriculums where CurriculumCode=?",array($profile['curriculumCode']));#get CurriculumID
                session()->put('curriculumID',$cID[0]->IndexID);
            } else {
                throw new Exception('Unable to fetch profile data');
            }

            $outstandingbalance = DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_ES_GetOutstandingBalanceFromStudentLedger ?", [session()->get('idNumber')]);
            if ($outstandingbalance[0]->OutstandingBalance > 0) {
                $recordExists = DB::connection(session()->get('db'))->select("SELECT * FROM ES_RegisterWithBalance WHERE TermID = ? AND StudentNo = ?", [$profile['termID'], session()->get('idNumber')]);
                if (!isset($recordExists[0])) {
                    $allowWithBalance=false;
                }else{
                    $allowWithBalance=true;
                }
            }
            
            $regID = DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
            $registration[0] = [];

            if ($regID || isset($regID[0]->regID)) {
                $registration = DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetStudentRegistration_r2 ?, ?", [$regID[0]->regID, session()->get('idNumber')]);
            } 

            $result=DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_isUndergrad ?,?",[session()->get('idNumber'),session()->get('campusID')]);

            if($result[0]->Result==1){
                // $isOpen=DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_isEnrollmentOpen ?,?",[$registration[0]->TermID,session()->get('campusID')]);
                $query = "
                DECLARE @isOpen BIT;
                DECLARE @enrollmentStartDate DATE;
                DECLARE @enrollmentEndDate DATE;
    
                SET @isOpen = 0;
    
                SELECT 
                    @enrollmentStartDate = StartEnrollment,
                    @enrollmentEndDate = EndEnrollment
                FROM ES_AYTermConfig
                WHERE TermID = ? AND CampusID = ?;
    
                IF @enrollmentStartDate IS NOT NULL AND @enrollmentEndDate IS NOT NULL
                BEGIN
                    IF GETDATE() BETWEEN @enrollmentStartDate AND @enrollmentEndDate
                    BEGIN
                        SET @isOpen = 1;
                    END
                END
                SELECT @isOpen AS isOpen, @enrollmentStartDate AS StartEnrollment, @enrollmentEndDate AS EndEnrollment ;";
    
            $isOpenResult = DB::connection(session()->get('db'))->select($query, [$profile['termID'],session()->get('campusID')]);
            $isOpenResult[0]->isOpen=$isOpenResult[0]->isOpen==0? false : true;
            } 

            return Inertia::render('Enrollment/EnrollmentPage', [
                'reg' =>  $registration[0],
                'data' => $data,
                'enrollment'=> $isOpenResult[0],
                'info'=>$profile,
                'allow'=> $allowWithBalance
            ]);
        
        } catch (Exception $e) {
            session()->flush();
            session()->regenerateToken();
            
            return redirect('/')->withErrors(['status' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function getEnrollSubject(Request $request){

        $response = Subject::getEnrolledSubject($request->data);
        return response()->json($response);

    }

    public function deleteSubjects(Request $request){

        foreach($request->selectedSub as $sub){
            DB::connection(session()->get('db'))->table('dbo.ES_RegistrationDetails')
                ->where('RegID',$sub['RegID'])
                ->where('ScheduleID',$sub['ScheduleID'])
                ->delete();
        }

        $response = $this->getEnrollSubject(new Request(['data' => $sub['RegID']]));
        return response()->json($response->original);

    }

    public function saveSubjects(Request $request){
        if(!$request->RegID){
            $response = DB::connection(session()->get('db'))->statement("EXEC dbo.CUSTOM_sp_SaveEnrollment ?,?,?,?,?,?,?,?",array(session()->get('idNumber'),intval($request->term),session()->get('campus'),0,0,0,1,ES_Student::YearLevelID($request->yearLevel))); # saveEnrollment array($request->info['studentID'],intval($request->info['termID']),$request->info['campusID'],0,0,0,1,ES_Student::YearLevelID($request->info['yearLevel']))
            $regID = DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
            $RegID=$regID[0]->regID;
        }else{
            $RegID=$request->RegID;
        }

        $enrol = Subject::getEnrolledSubject($request->RegID);
        $count=count($enrol);
        $sortedData = collect($request->e)->sortBy('Cntr')->values()->all();

        foreach ($sortedData as $sub) {
            $preRequisites=Subject::getPreRequisites($sub['SubjectID']);
            $count++;
            $conflict=0;
            $ispass=DB::connection(session()->get('db'))->select("select top 1 FinalRemarks from dbo.ES_Grades where StudentNo=? and SubjectID=?",array(session()->get('idNumber'),$sub['SubjectID'])); #filter if already pass the subject
            
            if($ispass && $ispass[0]->FinalRemarks=='Passed'){
                return response()->json(['error' => 'Subject '.$sub['SubjectCode'].' Already Passed']);
            }
            
            if(count($enrol)>0){
                foreach($enrol as $enrol_sub){
                    $result=DB::connection(session()->get('db'))->select("EXEC dbo.sp_CheckSchedConflicts ?,?",array($sub['ScheduleID'],$enrol_sub->ScheduleID)); #filter conflict
                    $conflict=$conflict+$result[0]->Conflict;
                    if($result[0]->Conflict >0){
                        return response()->json(['error' => "Conflict detected between schedules: ". $sub['ScheduleID']." and ".$enrol_sub->ScheduleID]);
                    }
                }
            }
            
            if($preRequisites!=null){
                $requesites="";
                foreach($preRequisites as $preReq){
                    $ifPass=DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetSubjectPreRequisiteIfPassed ?,?,?",array(session()->get('idNumber'),$preReq->SubjectID,0)); 
                    $requesites.="\n- ".$preReq->SubjectCode.' '.$ifPass[0]->Remarks;
                    if($ifPass==null || $ifPass[0]->Remarks=='Incomplete' || $ifPass[0]->Remarks=='Failed'){
                        return response()->json([
                            'error' => "Failed to meet prerequisites of ScheduleID ".$sub['SubjectCode'].$requesites
                        ]);
                    }
                }
                DB::connection(session()->get('db'))->statement("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$sub['ScheduleID'],$count));
            }else{
                DB::connection(session()->get('db'))->statement("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$sub['ScheduleID'],$count));     
            }
        }
        return response()->json(['message' => 'Subjects saved successfully']);
    }



}
