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
        $campusID =$request->params['campusID'];
        $termID = $request->params['termID'];
        $studentNo = $request->params['studentID'];
        $collegeID = $request->params['collegeID'];
        $progID = $request->params['progID'];
        
        // Get the program class code
        $progClass = DB::select("SELECT dbo.fn_StudentProgClassCode(?) AS ProgClass", [$studentNo]);
        $progClass = $progClass[0]->ProgClass;
        
        // Determine the condition based on the program class
        $condition = ($progClass == 50) ? "P.ProgClass = '50'" : "P.ProgClass >= '60'";
        
        // Determine the column and value based on CollegeID
        $programID_CollegeID = ($collegeID == 2) ? 'CS.ProgramID' : 'CS.CollegeID';
        $programID_CollegeID_ = ($collegeID == 2) ? $progID : $collegeID;

        $schedules=[];
        $filteredSections = [];

        $sql = "
        SELECT SectionID,
            CollegeCode,
            ProgCode,
            SectionName,
            CurriculumID,
            IsBlock,
            YearLevelID
        FROM ES_ClassSections CS
        LEFT JOIN ES_Programs P ON P.ProgID = CS.ProgramID
        LEFT JOIN ES_Colleges C ON CS.CollegeID = C.CollegeID
        WHERE (CS.CampusID = ? 
            AND TermID = ? 
            AND IsBlock = '1' 
            AND $condition)
        AND ($programID_CollegeID = ? 
            OR CS.SectionID IN (
                SELECT SectionID FROM dbo.ES_ClassSchedules 
                WHERE ScheduleID IN (
                    SELECT ScheduleID FROM ES_ClassSchedules_AllowedOtherPrograms 
                    WHERE ProgramID = ?)
            )
            OR CS.SectionID IN (
                SELECT SectionID FROM dbo.ES_ClassSchedules 
                WHERE ScheduleID IN (
                    SELECT ScheduleID FROM dbo.ES_ClassSchedules_AllowedStudents 
                    WHERE StudentNo = ?)
            )
        )
        ORDER BY CollegeCode, SectionName";
        $sections=DB::connection(session()->get('db'))->select($sql, [$campusID, $termID, $programID_CollegeID_, $progID, $studentNo]);
        foreach($sections as $section){
            $requestparam = new Request(['data' => [$section->SectionID,  $studentNo, $collegeID, $progID]]);
            $schedule=$this->getBlockClassSchedule($requestparam);
            if (!empty($schedule)) {
                $schedules[$section->SectionID] = $schedule;
                $filteredSections[] = $section;
            }
        }
        return response()->json(['sections'=>$filteredSections, 'schedules'=>$schedules]);
    }

    public function getSection(Request $request){
        $campusID =$request->params['campusID'];
        $termID = $request->params['termID'];
        $studentNo = $request->params['studentID'];
        $collegeID = $request->params['collegeID'];
        $progID = $request->params['progID'];

        $response=DB::connection(session()->get('db'))->select("EXEC dbo.CUSTOM_ES_getBlockSections ?,?,?,?,?",[$campusID, $termID,  $studentNo, $collegeID, $progID]); #Params CampusID, TermID, StudentNo, CollegeID, ProgID
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
    
        return ($filteredResponse);
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
