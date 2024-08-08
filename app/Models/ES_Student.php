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

    public function SaveSubject($RegID, $Schedule, $Seq)
    { 
        DB::select("EXEC dbo.sp_SaveEnrolledSubjects ?,?,?",array($RegID,$Schedule,$Seq));
        return $RegID;
    }
}
