<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DBOSession extends Model
{
    use HasFactory;
    protected $table = 'dbo.sessions';
    public $timestamps = false; 

}
