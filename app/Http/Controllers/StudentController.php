<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use App\Models\Curriculum;
use App\Models\Registration;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;    
use Exception;

class StudentController extends Controller
{
    public function show()
    { 
        try {
            // Fetch registration ID using the session ID number
            $regID = DB::select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
        
            // Check if registration ID was returned
            if (empty($regID) || !isset($regID[0]->regID)) {
                throw new Exception('No registration ID found.');
            }
        
            // Fetch student registration details
            $registration = DB::select("EXEC dbo.ES_GetStudentRegistration_r2 ?, ?", [$regID[0]->regID, session()->get('idNumber')]);
        
            // Check if registration details were returned
            if (empty($registration) || !isset($registration[0])) {
                throw new Exception('No registration details found.');
            }
        
            // Prepare data for the view
            $data = [
                'user' => session()->get('idNumber'),
                'token' => session()->get('token'),
                'campus' => session()->get('campusID'),
            ];
        
            // Render the view using Inertia
            return Inertia::render('Enrollment/EnrollmentPage', [
                'reg' => $registration[0],
                'data' => $data
            ]);
        
        } catch (Exception $e) {
            // Handle the error: flush and regenerate the session token
            session()->flush();
            session()->regenerateToken();
            
            // Redirect to home with error message
            return redirect('/')->withErrors(['status' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function getEnrollSubject(Request $request){
        $response = DB::select("EXEC dbo.ES_GetEnrolledSubjects '".$request->data."'"); # get enrolledsub
        return response()->json($response);
    }

    public function deleteSubjects(Request $request){
        foreach($request->selectedSub as $sub){
            DB::table('dbo.ES_RegistrationDetails')
                ->where('RegID',$sub['RegID'])
                ->where('ScheduleID',$sub['ScheduleID'])
                ->delete();
        }
        $response = $this->getEnrollSubject(new Request(['data' => $sub['RegID']]));
        return response()->json($response->original);
    }

    public function saveSubjects(Request $request){
        return(array($request->RegID,8));
        $sortedData = collect($request->selectedClassSched)->sortBy('Cntr')->values()->all();
        foreach ($sortedData as $sub) {
            $preRequisites=DB::select("EXEC dbo.ES_GetPrerequisiteSubjects ?,?,?",array(session()->get('idNumber'),$request->cID,$sub['SubjectID']));
            if($preRequisites!=null){
                foreach($preRequisites as $preReq){
                    $ifPass=DB::select("EXEC dbo.ES_GetSubjectPreRequisiteIfPassed ?,?,?",array(session()->get('idNumber'),$preReq->SubjectID,0));
                    if($ifPass==null || $ifPass[0]->Remarks=='Incomplete' || $ifPass[0]->Remarks=='Failed'){
                        return ($ifPass);
                    }
                }
                DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],8));
            }
            DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],8));
        }
        // return response()->json(['message' => 'Subjects saved successfully']);
    }



}
