<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ES_StudentsController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

<<<<<<< Updated upstream
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register')
    ]);
})->middleware('ifAuth');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
=======
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

>>>>>>> Stashed changes
    Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment.index');

    Route::resource('students',ES_StudentsController::class);
    Route::get('/student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::post('/getBlockClassSchedule', [EnrollmentController::class, 'getBlockClassSchedule'])->name('getBlockClassSchedule');
    Route::post('/getFreeClassSchedule', [EnrollmentController::class, 'getFreelassSchedule'])->name('getFreeClassSchedule');

    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});
