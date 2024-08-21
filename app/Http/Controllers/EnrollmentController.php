<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    public function getBlockSection(Request $request){
        $response=DB::select("EXEC dbo.ES_getBlockSections ?,?,?,?,?",$request->params); #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        return response()->json($response);
    }

    public function getFreeSection(Request $request){
        $response=DB::select("EXEC dbo.ES_getFreeSections ?,?,?,?,?",$request->params);   #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        return response()->json($response);
    }

    public function getBlockClassSchedule(Request $request){
        $response=DB::select("EXEC dbo.ES_getBlockClassSchedules_r2 ?,?,?,?,?",$request->data);

        return response()->json($response);
    }

    public function getFreeClassSchedule(Request $request){
        $response=DB::select("EXEC dbo.ES_getFreeClassSchedules_r2 ?,?,?,?,?",$request->data);
        return response()->json($response);
    }
}
