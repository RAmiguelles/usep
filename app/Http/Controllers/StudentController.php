<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use App\Models\Registration;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function show(string $id)
    {   
        $student=ES_Student::where('StudentNo',$id)->first();
        $reg=$student->Reg->last();
        $enroll_sub = DB::select("EXEC dbo.ES_GetEnrolledSubjects '".$reg->RegID."'"); # get enrolledsub
        $blockSec=DB::select("EXEC dbo.ES_getBlockSections ?,?,?,?,?",array($reg->CampusID,$reg->TermID,$student->StudentNo,$reg->CollegeID,$reg->ProgID));
        $freeSec=DB::select("EXEC dbo.ES_getFreeSections ?,?,?,?,?",array($reg->CampusID,$reg->TermID,$student->StudentNo,$reg->CollegeID,$reg->ProgID));
        
        return Inertia::render('Enrollment/EnrollmentPage',[
                'student'=>$student,
                'enroll_sub'=>$enroll_sub,
                'blockSec'=>$blockSec,
                'freeSec'=>$freeSec,
                'reg'=>$reg
        ]);
    }
<<<<<<< Updated upstream
=======

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
        $stud=new ES_Student();
        $reg=new Registration();
        $sortedData = collect($request->selectedClassSched)->sortBy('Cntr')->values()->all();
        foreach ($sortedData as $sub) {
            $preRequisites=$reg::getPreRequisites(session()->get('idNumber'),$stud::CurriculumID(session()->get('idNumber')),$sub['ScheduleID']);
            if($preRequisites!=null){
                foreach($preRequisites as $preReq){
                    $ifPass=DB::select("EXEC dbo.ES_GetSubjectPreRequisiteIfPassed ?,?,?",array(session()->get('idNumber'),$preReq->SubjectID,0));
                    if($ifPass==null || $ifPass[0]->Remarks=='Incomplete'){
                        return ("failed");
                    }
                }
                return ("passed");
                // DB::table('dbo.ES_RegistrationDetails')->insert(
                //     ['RegID' => $request->RegID, 'ScheduleID' => $sub['ScheduleID'], 'RegTagID'=> 0, 'SeqNo'=> 8]
                // );
            }
            // DB::table('dbo.ES_RegistrationDetails')->insert(
            //     ['RegID' => $request->RegID, 'ScheduleID' => $sub['ScheduleID'], 'RegTagID'=> 0, 'SeqNo'=> 8]
            // );
        }
        // return response()->json(['message' => 'Subjects saved successfully']);
    }



>>>>>>> Stashed changes
}
