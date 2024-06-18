<?php

namespace App\Http\Controllers;

use App\Models\ES_Student;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class ES_StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $student=ES_Student::where('StudentNo','2021-02497')->first();
        print_r($student->Reg);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student=ES_Student::where('StudentNo',$id)->first();
        $reg=$student->Reg->last();
        $enroll_sub = DB::select("EXEC dbo.ES_GetEnrolledSubjects '".$reg->RegID."'"); # get enrolledsub
        $blockSec=DB::select("EXEC dbo.ES_getBlockSections ?,?,?,?,?",array($reg->CampusID,$reg->TermID,$student->StudentNo,$reg->CollegeID,$reg->ProgID));
        $freeSec=DB::select("EXEC dbo.ES_getFreeSections ?,?,?,?,?",array($reg->CampusID,$reg->TermID,$student->StudentNo,$reg->CollegeID,$reg->ProgID));
        
        return Inertia::render('Enrollment/test',[
                'student'=>$student,
                'enroll_sub'=>$enroll_sub,
                'blockSec'=>$blockSec,
                'freeSec'=>$freeSec,
                'reg'=>$reg
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
