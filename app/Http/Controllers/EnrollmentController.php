<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    public function index(){
        $res=Http::get('https://pokeapi.co/api/v2/pokemon/');
        $test=$res->json();
        return Inertia::render('Enrollment/Enrollment',[
            'test'=>$test
        ]);
    }

    public function getBlockClassSchedule(Request $request){
        $sectionId=$request->sectionId;
        $studentNo=$request->studentNo;
        $collegeId=$request->collegeId;
        $progId=$request->progId;
        $regId=$request->regId;
        $blockSec=DB::select("EXEC dbo.ES_getBlockClassSchedules_r2 ?,?,?,?,?",$request->data);

        return response()->json($blockSec);
    }

    public function getFreeClassSchedule(Request $request){
        $sectionId=$request->sectionId;
        $studentNo=$request->studentNo;
        $collegeId=$request->collegeId;
        $progId=$request->progId;
        $regId=$request->regId;
        $blockSec=DB::select("EXEC dbo.ES_getFreeClassSchedules_r2 ?,?,?,?,?",$request->data);

        return response()->json($blockSec);
    }
}
