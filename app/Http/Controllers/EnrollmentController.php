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
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_getBlockSections_test ?,?,?,?,?",$request->params); #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        return response()->json($response);
    }

    public function getSection(Request $request){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_ES_getBlockSections ?,?,?,?,?",$request->params); #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        return response()->json($response);
    }

    public function getFreeSection(Request $request){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_getFreeSections ?,?,?,?,?",$request->params);   #Params CampusID, TermID, StudentNo, CollegeID, ProgID
        return response()->json($response);
    }

    public function getBlockClassSchedule(Request $request) {
        $response = DB::connection(session()->get('db'))->select("EXEC dbo.ES_getBlockClassSchedules ?,?,?,?", $request->data);
        $filteredResponse = [];

        foreach ($response as $item) {
            $ispass = DB::connection(session()->get('db'))->select(
                "SELECT TOP 1 FinalRemarks FROM dbo.ES_Grades WHERE StudentNo = ? AND SubjectID = ?",
                [session()->get('idNumber'), $item->SubjectID]
            );
            if (!$ispass || $ispass[0]->FinalRemarks !== 'Passed') {
                $inCurriculum=DB::connection(session()->get('db'))->select("EXEC dbo.sp_Reg_CheckSubjectInTheCurriculum_r2 ?,?,?", [session()->get('idNumber'),session()->get('curriculumID'),$item->SubjectID]);
                if($inCurriculum){
                    $filteredResponse[] = $item;  
                }
            }
        }
    
        return response()->json($filteredResponse);
    }

    public function getFreeClassSchedule(Request $request){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_getFreeClassSchedules ?,?,?,?",$request->data);
        return response()->json($response);
    }

    public function getassessment(Request $request){
        $response=DB::connection(session()->get('db'))->select("ES_GetTableofFees_ForAssessment ?,?",array($request->template,0));
        $total=DB::connection(session()->get('db'))->select("select dbo.fn_AssessmentTotalAssessed(?,?) as total",array($request->term,session()->get('idNumber')));
        return response()->json([
            'response' => $response,
            'total' => $total[0]->total
        ]);
    }
}
