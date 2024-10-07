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
        $response=DB::connection(session()->get('db'))->select("EXEC dbo.ES_GetEnrolledSubjects '".$regID."'");
        return ($response);
    }
}
