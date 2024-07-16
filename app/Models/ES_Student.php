<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Registration;
use Illuminate\Support\Facades\DB;

class ES_Student extends Model
{
    use HasFactory;

    protected $table = 'dbo.vw_Students';

    protected $hidden = ['SSMA_TimeStamp'];

    public function Registration($id)
    {
        $reg=DB::table("dbo.ES_Registrations")->where('StudentNo',$id)->get()->last();
        return $reg;
    }

    public function SaveSubject($RegID, $Schedule, $Seq)
    { 
        DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$Schedule,$Seq));
        return $RegID;
    }

    protected function CurriculumID($id){
        $cur=DB::select("EXEC dbo.ES_GetStudentInfo ?",array($id));
        return ($cur[0]->CurriculumID);
    }
}
