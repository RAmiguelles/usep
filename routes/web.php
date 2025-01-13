<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('ifUser')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');
    Route::get('login', function(){return Inertia::render('Auth/Login');})->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login');;
});
Route::middleware('User')->group(function () {
    Route::middleware('client')->group(function () {
        Route::get('/student', [StudentController::class, 'show'])->name('student.show');
        Route::post('/student/getEnrollSubject', [StudentController::class, 'getEnrollSubject'])->name('getEnrollSubject');
        Route::post('/deleteSubjects', [StudentController::class, 'deleteSubjects'])->name('deleteSubjects');
        Route::post('/saveSubjects', [StudentController::class, 'saveSubjects'])->name('saveSubjects');
        Route::post('/isFinal', [StudentController::class, 'isFinal'])->name('isFinal');
        Route::get('/evaluation', [StudentController::class, 'Evaluation'])->name('evaluation');

        Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment.index');
        Route::post('/getBlockSection', [EnrollmentController::class, 'getBlockSection'])->name('getBlockSection');
        Route::post('/getSection', [EnrollmentController::class, 'getSection'])->name('getSection');
        Route::post('/getFreeSection', [EnrollmentController::class, 'getFreeSection'])->name('getFreeSection');
        Route::post('/getBlockClassSchedule', [EnrollmentController::class, 'getBlockClassSchedule'])->name('getBlockClassSchedule');
        Route::post('/getFreeClassSchedule', [EnrollmentController::class, 'getFreeClassSchedule'])->name('getFreeClassSchedule');
        Route::post('/assessment', [EnrollmentController::class, 'getassessment'])->name('getassessment');
        Route::post('/checkconflict', [EnrollmentController::class, 'CheckConflict'])->name('checkconflict');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin', [AdminController::class, 'index'])->name('admin');
        Route::post('/colleges', [AdminController::class, 'College'])->name('colleges');
        Route::post('/programs', [AdminController::class, 'Program'])->name('programs');
        Route::post('/college/Enrollment', [AdminController::class, 'CollegeEnrollment'])->name('college-Enrollment');
        Route::post('/college/SaveEnrollment', [AdminController::class, 'SaveEnrollmentSetting'])->name('SaveEnrollment');
    });

    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});
