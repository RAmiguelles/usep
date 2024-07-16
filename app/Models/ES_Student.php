<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Registration;

class ES_Student extends Model
{
    use HasFactory;

    protected $table = 'dbo.vw_Students';

    protected $hidden = ['SSMA_TimeStamp'];

    public function Reg()
    {
        return $this->hasMany(Registration::class,'StudentNo','StudentNo');
    }

    protected function CurriculumID($id){
        $cur=DB::select("EXEC dbo.ES_GetStudentInfo ?",array($id));
        return ($cur[0]->CurriculumID);
    }
}
