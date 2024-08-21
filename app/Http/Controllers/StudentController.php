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
            // Prepare data for the view
            $data = [
                'user' => session()->get('idNumber'),
                'token' => session()->get('token'),
                'campus' => session()->get('campusID'),
            ];
        
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

            $result=DB::select("EXEC dbo.CUSTOM_isUndergrad ?,?",[session()->get('idNumber'),session()->get('campusID')]);
            if($result[0]->Result==1){
                // $isOpen=DB::select("EXEC dbo.CUSTOM_isEnrollmentOpen ?,?",[$registration[0]->TermID,session()->get('campusID')]);
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
    
            $isOpenResult = DB::select($query, [$registration[0]->TermID,session()->get('campusID')]);
            $isOpenResult[0]->isOpen=$isOpenResult[0]->isOpen==0? false : true;
            } 
        
            // Render the view using Inertia
            return Inertia::render('Enrollment/EnrollmentPage', [
                'reg' => $registration[0],
                'data' => $data,
                'enrollment'=> $isOpenResult[0]
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
        $enrol = DB::select("EXEC dbo.ES_GetEnrolledSubjects '".$request->RegID."'"); # get enrolledsub
        $count=count($enrol);
        $sortedData = collect($request->selectedClassSched)->sortBy('Cntr')->values()->all();
        foreach ($sortedData as $sub) {
            $count++;
            $conflict=0;
            if(count($enrol)>0){
                foreach($enrol as $enrol_sub){
                    $result=DB::select("EXEC dbo.sp_CheckSchedConflicts ?,?",array($sub['ScheduleID'],$enrol_sub->ScheduleID));
                    $conflict=$conflict+$result[0]->Conflict;
                    if($result[0]->Conflict >0){
                        return response()->json([
                            'error' => "Conflict",
                            'sub1' => $sub['ScheduleID'],
                            'sub2' => $enrol_sub->ScheduleID
                        ]);
                    }
                }
                if($conflict==0){
                    $preRequisites=DB::select("EXEC dbo.ES_GetPrerequisiteSubjects ?,?,?",array(session()->get('idNumber'),$request->cID,$sub['SubjectID']));
                    if($preRequisites!=null){
                        foreach($preRequisites as $preReq){
                            $ifPass=DB::select("EXEC dbo.ES_GetSubjectPreRequisiteIfPassed ?,?,?",array(session()->get('idNumber'),$preReq->SubjectID,0));
                            if($ifPass==null || $ifPass[0]->Remarks=='Incomplete' || $ifPass[0]->Remarks=='Failed'){
                                return response()->json([
                                    'error' => "Failed",
                                    'remarks' => $ifPass[0]->Remarks,
                                    'sub' => $sub['ScheduleID']
                                ]);
                            }
                        }
                        DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],$count));
                    }else{
                        DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],$count));     
                    }
                }else{
                    return response()->json(['error' => 'Something went wrong!']);
                }
            }else{
                $preRequisites=DB::select("EXEC dbo.ES_GetPrerequisiteSubjects ?,?,?",array(session()->get('idNumber'),$request->cID,$sub['SubjectID']));
                if($preRequisites!=null){
                    foreach($preRequisites as $preReq){
                        $ifPass=DB::select("EXEC dbo.ES_GetSubjectPreRequisiteIfPassed ?,?,?",array(session()->get('idNumber'),$preReq->SubjectID,0));
                        if($ifPass==null || $ifPass[0]->Remarks=='Incomplete' || $ifPass[0]->Remarks=='Failed'){
                            return ($ifPass);
                        }
                    }
                    DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],$count));
                }else{
                    DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($request->RegID,$sub['ScheduleID'],$count));     
                }
            }

        }
        return response()->json(['message' => 'Subjects saved successfully']);
    }



}
