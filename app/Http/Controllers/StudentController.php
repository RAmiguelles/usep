<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
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
}
