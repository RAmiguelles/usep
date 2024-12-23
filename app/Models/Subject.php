<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Subject extends Model
{
    use HasFactory;

    protected function getPreRequisites($subID){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetPrerequisiteSubjects ?,?,?",array(session()->get('idNumber'),session()->get('curriculumID'),$subID));
        return ($response);
    }

    protected function getEnrolledSubject($regID){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetEnrolledSubjects'".$regID."'");
        return ($response);
    }

    protected function EnrolledSubisFinal($regID){
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetEnrolledSubjects_OES'".$regID."'");
        foreach($response as $res){
            if($res->isFinal==1){
                return (true);
            }
        }
        return (false);
    }

    protected function GetSubjectPreRequisiteIfPassed($subjectID,$subjectEquivalentID=0){
        $query = "
        SELECT TOP 1
            dbo.fn_GradeCreditTheUnit(
                (SELECT TOP 1 [Format]
                FROM [ES_GradingSystemSettings]
                WHERE Classification = g.ProgClassID),
                g.Midterm,
                g.Final,
                g.ReExam,
                g.ProgClassID) AS CreditTheUnit,
            dbo.fn_GradeRemarks(
                (SELECT TOP 1 [Format]
                FROM [ES_GradingSystemSettings]
                WHERE Classification = g.ProgClassID),
                g.Midterm,
                g.Final,
                g.ReExam,
                g.ProgClassID) AS Remarks
        FROM ES_Grades g
        WHERE g.StudentNo = :studentNo
            AND (
                g.SubjectID IN (
                    SELECT SubjectID
                    FROM dbo.ES_PreRequisites
                    WHERE SubjectID_Curriculum = :subjectID
                    AND options = 'Equivalent'
                    AND CurriculumIndexID IS NULL
                )
                OR g.SubjectID = :subjectID
                OR g.SubjectID = CASE WHEN :subjectEquivalentID = 0 THEN :subjectID ELSE :subjectEquivalentID END
                OR g.EquivalentSubjectID = CASE WHEN :subjectEquivalentID = 0 THEN :subjectID ELSE :subjectEquivalentID END
            )
            AND (
                LOWER(dbo.fn_GradeRemarks(
                    (SELECT TOP 1 [Format]
                    FROM [ES_GradingSystemSettings]
                    WHERE Classification = g.ProgClassID),
                    g.Midterm,
                    g.Final,
                    g.ReExam,
                    g.ProgClassID)) IN ('passed', 'credited', 'incomplete')
            )
        UNION
        SELECT TOP 1
            CASE LOWER(D.Remarks)
                WHEN 'passed' THEN '1'
                WHEN 'credited' THEN '1'
                WHEN 'incomplete' THEN '0'
            END AS CreditTheUnit,
            D.[Remarks]
        FROM [dbo].[ES_Grades_FromOtherSchool] M
        INNER JOIN [dbo].[ES_Grades_FromOtherSchoolDetails] D
            ON M.[KeyID] = D.[KeyID]
        WHERE [StudentNo] = :studentNo
            AND [EquivalentSubjectID] = :subjectID
            AND (LOWER(D.[Remarks]) IN ('passed', 'incomplete', 'credited'))
        ORDER BY CreditTheUnit DESC
        ";

        return DB::select($query, [
            'studentNo' => session()->get('IdNumber'),
            'subjectID' => $subjectID,
            'subjectEquivalentID' => $subjectEquivalentID,
        ]);
    }
}
