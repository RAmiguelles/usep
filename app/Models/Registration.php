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
}
