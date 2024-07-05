<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class StudentController extends Controller
{
    public function show(string $id)
    {   
        // $url="https://api.usep.edu.ph/student/getProfile/".session()->get('idNumber')."/".session()->get('campusID');
        // $result = Http::withHeaders([
        //     'Authorization' => session()->get('token'),
        //     'Content-Type' => 'application/json',
        // ])->get($url);
        // $student=$result->json();
        $reg=new ES_Student();
        $registration=$reg->Registration($id); #get registraion ID
        // $enroll_sub = DB::select("EXEC dbo.ES_GetEnrolledSubjects '".$registration->RegID."'"); # get enrolledsub
        // $blockSec=DB::select("EXEC dbo.ES_getBlockSections ?,?,?,?,?",array($student['campusID'],$student['termID'],$student['studentID'],$student['collegeID'],$student['progID'])); #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        // $freeSec=DB::select("EXEC dbo.ES_getFreeSections ?,?,?,?,?",array($student['campusID'],$student['termID'],$student['studentID'],$student['collegeID'],$student['progID']));   #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        $data=[
            'user'=>session()->get('idNumber'),
            'token'=>session()->get('token'),
            'campus'=>session()->get('campusID'),
        ];
        return Inertia::render('Enrollment/EnrollmentPage',[
                // 'student'=>$student,
                // 'enroll_sub'=>$enroll_sub,
                // 'blockSec'=>$blockSec,
                // 'freeSec'=>$freeSec,
                'reg'=>$registration,
                'data'=>$data
        ]);
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
        $sortedData = collect($request->selectedClassSched)->sortBy('Cntr')->values()->all();
        foreach ($sortedData as $sub) {
            DB::table('dbo.ES_RegistrationDetails')->insert(
                ['RegID' => $request->RegID, 'ScheduleID' => $sub['ScheduleID'], 'RegTagID'=> 0, 'SeqNo'=> 8]
            );
        }
        return response()->json(['message' => 'Subjects saved successfully']);
    }



}
