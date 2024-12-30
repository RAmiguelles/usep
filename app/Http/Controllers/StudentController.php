<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use App\Models\Registration;
use App\Models\Subject;
use App\Models\User;
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

            // $headers = [
            //     'Authorization' =>$data['token'],
            //     'Content-Type' => 'application/json',
            // ];

            // $profileResponse = Http::withHeaders($headers)->get("https://api.usep.edu.ph/student/getProfile/{$data['user']}/{$data['campus']}");

            // if ($profileResponse->successful()) {
            //     $profileData = $profileResponse->json();
            //     $profile = $profileData;
            //     $cID = DB::connection(session()->get('db'))->select("select IndexID from ES_Curriculums where CurriculumCode=?",array($profile['curriculumCode']));#get CurriculumID
            //     session()->put('curriculumID',$cID[0]->IndexID);
            // } else {
            //     throw new Exception('Unable to fetch profile data');
            // }
            $status=[];
            $profileQuery=DB::connection(session()->get('db'))->select(
                "SELECT TOP 1
                    S.StudentNo ,
                    S.LastName, 
                    (YEAR(s.DateAdmitted)) AS yearOfEntry,
                    S.FirstName, 
                    S.MiddleName,
                    S.LastName + ', ' + S.FirstName + ' ' + S.MiddleInitial AS StudentName ,
                    S.ProgID ,
                    dbo.fn_ProgramCollegeID(S.ProgID) AS CollegeID ,
                    dbo.fn_ProgramCollegeCode(S.ProgID) AS CollegeCode ,
                    dbo.fn_ProgramCollegeName(S.ProgID) AS CollegeName ,
                    dbo.fn_ProgramCode(S.ProgID) AS ProgramCode ,
                    dbo.fn_ProgramName(S.ProgID) AS ProgramName ,
                    dbo.fn_MajorName(s.MajorDiscID) AS MajorStudy ,
                    -- S.YearLevelID ,
                    -- dbo.fn_YearLevel(S.YearLevelID) AS YearLevel ,
                    (select YearLevelID from [dbo].[fn_getAutoYearLevel_OES_2](S.StudentNo,2)) AS YearLevelID,
                    (select YearLevel from [dbo].[fn_getAutoYearLevel_OES_2](S.StudentNo,2)) AS YearLevel,
                    S.Gender ,
                    s.CurriculumID ,
                    dbo.fn_CurriculumCode(s.CurriculumID) AS CurriculumCode ,
                    CONVERT(VARCHAR(12), s.DateOfBirth, 107) Birthdate ,
                    dbo.fn_StudentHomeAddress(s.studentno) AS [Address] ,
                    CONVERT(VARCHAR(12), s.DateAdmitted, 107) AS DateAdmitted ,
                    dbo.fn_CurrTotalSubjects(s.CurriculumID) AS TotalCurriculumSubjects ,
                    dbo.[fn_CurrTotalCreditUnits](s.CurriculumID) AS CurrTotalCreditUnits ,
                    s.TblFeesID ,
                    dbo.fn_TemplateCode(s.TblFeesID) AS FeesTemplate ,
                    dbo.[fn_TemplateTermID](s.TblFeesID) AS FeesTermID ,
                    s.StatusID ,
                    dbo.fn_StudentStatus(S.StatusID) AS [Status] ,
                    ForeignStudent ,
                    dbo.fn_CurricularYearLevel2(s.StudentNo, s.ProgID, s.YearLevelID) AS cYearLevelID ,
                    dbo.fn_YearLevel(dbo.fn_CurricularYearLevel2(s.StudentNo, s.ProgID,
                    s.YearLevelID)) AS cYearLevel ,
                    S.MaxUnitsLoad,
                    S.CampusID,
                    CAST(dbo.fn_TotalCreditUnitsEarned_OES(S.StudentNo) AS INT) AS UnitsEarned,
                    dbo.fn_DefaultTermID_OES() AS TermID,
                    CASE 
                        WHEN DATEDIFF(DAY, S.DateAdmitted, GETDATE()) < (P.ProgYears + 1) * 365 THEN 'Non_Paying'
                        ELSE 'Paying'
                    END AS isPaying
                FROM    ES_Students S
                LEFT JOIN ES_Programs as P on P.ProgID = S.ProgID AND P.CollegeID = dbo.fn_ProgramCollegeID(S.ProgID)
                WHERE   S.StudentNo = ?",
                [$data['user']]
            );

            if($profileQuery){
                $profile=$profileQuery[0];
                session()->put('curriculumID',intval($profile->CurriculumID));
            }else{
                throw new Exception('Unable to fetch profile data');
            }
    
            $outstandingbalance = DB::connection(session()->get('db'))
                                    ->select("EXEC dbo.CUSTOM_ES_GetOutstandingBalanceFromStudentLedger ?", [session()->get('idNumber')]);
            if ($outstandingbalance[0]->OutstandingBalance > 0) {
                $recordExists = DB::connection(session()->get('db'))
                                    ->select("SELECT * FROM ES_RegisterWithBalance WHERE TermID = ? AND StudentNo = ?", [$profile->TermID, session()->get('idNumber')]);
                if (!isset($recordExists[0])) {
                    $allowWithBalance=false;
                }else{
                    $allowWithBalance=true;
                }
            }
            $status["allowWithBalance"]=$allowWithBalance;

            $regID = DB::connection(session()->get('db'))
                        ->select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
            $registration[0] = [];

            if ($regID || isset($regID[0]->regID)) {
                if($profile->isPaying !="Paying"){
                    $sql= "UPDATE
                    ES_Registrations
                    SET ValidationDate = GETDATE(), ValidatingOfficerID = 'OES'
                    WHERE regID = ? AND CampusID = ?";
                    DB::connection(session()->get('db'))->statement($sql,array($regID[0]->regID,session()->get('campusID')));
                }
                $registration = DB::connection(session()->get('db'))
                                    ->select("EXEC dbo.ES_GetStudentRegistration_r2 ?, ?", [$regID[0]->regID, session()->get('idNumber')]);
            } 

            $result=DB::connection(session()->get('db'))
                        ->select("EXEC dbo.CUSTOM_isUndergrad ?,?",[session()->get('idNumber'),session()->get('campusID')]);

            if($result[0]->Result==1){
                $IsPerCollegeEnrollment = DB::connection(session()->get('db'))
                                            ->select("SELECT IsPerCollegeEnrollment FROM ES_AYTerm WHERE TermID = ?", array($profile->TermID));
                $IsPerCollegeEnrollmentValue = $IsPerCollegeEnrollment[0]->IsPerCollegeEnrollment;

                if ($IsPerCollegeEnrollmentValue == 1) {
                    $isOpenResult=Registration::perCollegeisOpen($profile->TermID,$profile->CollegeID);
                    if(!$isOpenResult){
                        $isOpenResult=Registration::isOpen($profile->TermID);
                    }
                } else {
                    $isOpenResult=Registration::isOpen($profile->TermID);
                }

            } else{
                $isOpenResult=['isOpen'=>false];
            }
            $status["isOpen"]=$isOpenResult;
            // $final=["isFinal"=>false, "status"=>""];
            // if($regID || isset($regID[0]->regID)){
            //     $isFinal=Subject::EnrolledSubisFinal($regID[0]->regID);
            //     if($isFinal){
            //         $final=["isFinal"=>$isFinal, "status"=>"submitted"];
            //     }
            // }

            return Inertia::render('Enrollment/EnrollmentPage', [
                'reg' =>  $registration[0],
                'data' => $data,
                // 'enrollment'=> $isOpenResult,
                'info'=>$profile,
                // 'allow'=> $allowWithBalance,
                // 'final'=> $final
                'status'=>$status
            ]);

        
        } catch (Exception $e) {
            session()->flush();
            session()->regenerateToken();
            return redirect('/')->withErrors(['status' => 'Error: ' . "ERROR"]);
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

    public function isFinal(Request $request){
        try {
            $sql="UPDATE ES_RegistrationDetails 
                    SET isFinal = 1 
                    WHERE RegID = ?";
            DB::connection(session()->get('db'))->statement($sql, [$request->regID]);
            return response()->json(['message' => 'Success']);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveSubjects(Request $request){
        // if(!$request->RegID){
        //     $response = DB::connection(session()->get('db'))
        //                     ->statement("EXEC dbo.CUSTOM_sp_SaveEnrollment ?,?,?,?,?,?,?,?",array(session()->get('idNumber'),intval($request->term),session()->get('campus'),0,0,0,1,intval($request->yearLevelID))); # saveEnrollment array($request->info['studentID'],intval($request->info['termID']),$request->info['campusID'],0,0,0,1,ES_Student::YearLevelID($request->info['yearLevel']))
        //     $regID = DB::connection(session()->get('db'))
        //                 ->select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
        //     $RegID=$regID[0]->regID;
        // }else{
        //     $RegID=$request->RegID;
        // }
        $sortedData = collect($request->subject)->sortBy('Cntr')->values()->all();
        $enrol=[];
        $error=[];
        foreach ($sortedData as $sub) {
            $isExceeded=DB::connection(session()->get('db'))
                        ->select("SELECT 
                                    CASE 
                                        WHEN dbo.fn_GetNbrRegistered(?) < dbo.fn_ClassLimit(?) 
                                        THEN 0
                                        ELSE 1
                                    END AS isExceeded;",array($sub['ScheduleID'],$sub['ScheduleID'])
                                );
            if($isExceeded[0]->isExceeded =="1"){
                $error=['error' => $sub['SubjectTitle']. ' No Available Slot'];
                return response()->json($error);
            }
            $count=count($enrol);                                        #for sequence
            $count++;
            $conflict=false;
            if(count($enrol)>0){
                foreach($enrol as $key => $value){
                    $result=DB::connection(session()->get('db'))
                                ->select("EXEC dbo.sp_CheckSchedConflicts ?,?",array($sub['ScheduleID'],$value['ScheduleID'])); #filter conflict
                    if($result[0]->Conflict >0 || $value['SubjectID'] == $sub['SubjectID']){
                        $count--;
                        $error[]= $sub['SubjectTitle']." conflict with ".$value['SubjectTitle'];
                        $conflict=true;
                        continue;
                    }
                }
                if(!$conflict){
                    $sub['count'] = $count;
                    $enrol[]=$sub;
                }
            }else{
                $sub['count'] = $count;
                $enrol[]=$sub;
            }
            // DB::connection(session()->get('db'))
            //     ->statement("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$sub['ScheduleID'],$count));     
        }
        if (count($error) > 0) {
            return response()->json([$enrol,$error]);
        } else {
            DB::connection(session()->get('db'))
                        ->statement("EXEC dbo.CUSTOM_sp_SaveEnrollment ?,?,?,?,?,?,?,?",array(session()->get('idNumber'),intval($request->term),session()->get('campusID'),0,0,0,1,intval($request->yearLevel))); # saveEnrollment array($request->info['studentID'],intval($request->info['termID']),$request->info['campusID'],0,0,0,1,ES_Student::YearLevelID($request->info['yearLevel']))
            $regID = DB::connection(session()->get('db'))
                        ->select("EXEC dbo.CUSTOM_ES_GetCurrentStudReg ?", [session()->get('idNumber')]);
            $RegID=$regID[0]->regID;

            foreach($enrol as $en){
                DB::connection(session()->get('db'))
                ->statement("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$en['ScheduleID'],$en['count']));   
            }
            return response()->json(['message' => 'Subjects saved successfully']);
        }

    }
}
