<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('ifUser')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');
    Route::get('login', function(){return Inertia::render('Auth/Login');})->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login');
});
Route::middleware('User')->group(function () {
    Route::get('/student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::post('/student/getEnrollSubject', [StudentController::class, 'getEnrollSubject'])->name('getEnrollSubject');
    Route::post('/deleteSubjects', [StudentController::class, 'deleteSubjects'])->name('deleteSubjects');
    Route::post('/saveSubjects', [StudentController::class, 'saveSubjects'])->name('saveSubjects');

    Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/getBlockSection', [EnrollmentController::class, 'getBlockSection'])->name('getBlockSection');
    Route::post('/getFreeSection', [EnrollmentController::class, 'getFreeSection'])->name('getFreeSection');
    Route::post('/getBlockClassSchedule', [EnrollmentController::class, 'getBlockClassSchedule'])->name('getBlockClassSchedule');
    Route::post('/getFreeClassSchedule', [EnrollmentController::class, 'getFreelassSchedule'])->name('getFreeClassSchedule');

    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});
