<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Registration extends Model
{
    use HasFactory;
    protected $table = 'dbo.ES_RegistrationDetails';

    protected function getPreRequisites($id, $cur, $subID){
        $response=DB::connection(session()->get('db'))->select("select * from dbo.sis_getPrerequisite(?,?,?)");
        return ($response);
    }

    protected function isOpen($termID){
        $query = " SELECT 
                StartEnrollment, 
                FORMAT(EndEnrollment, 'MM/dd/yyyy') AS EndEnrollment,
                CASE 
                    WHEN GETDATE() BETWEEN StartEnrollment AND EndEnrollment THEN 1 
                    ELSE 0 
                END AS isOpen
                FROM 
                    ES_AYTermConfig
                WHERE 
                    TermID = ?;
                    ";
        $isOpenResult = DB::connection(session()->get('db'))->select($query, [$termID,session()->get('campusID')]);
        $isOpenResult[0]->isOpen=$isOpenResult[0]->isOpen==0? false : true;
        return $isOpenResult[0];
    }

    protected function perCollegeisOpen($termID,$colID){
        $query = " SELECT 
                StartEnrollment, 
                EndEnrollment, 
                CASE 
                    WHEN GETDATE() BETWEEN StartEnrollment AND EndEnrollment THEN 1 
                    ELSE 0 
                END AS isOpen
                FROM 
                    ES_College_Enrollment
                WHERE 
                    TermID = ? AND CollegeID=?;
                    ";
        $isOpenResult = DB::connection(session()->get('db'))->select($query, [$termID,$colID]);
        if(!$isOpenResult){
            return false;
        }
        $isOpenResult[0]->isOpen=$isOpenResult[0]->isOpen==0? false : true;
        return $isOpenResult[0];
    }

}
