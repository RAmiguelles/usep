<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/student/{id}', [StudentController::class, 'show'])->name('student.show');
    Route::post('/student/getEnrollSubject', [StudentController::class, 'getEnrollSubject'])->name('getEnrollSubject');
    Route::post('/deleteSubjects', [StudentController::class, 'deleteSubjects'])->name('deleteSubjects');
    Route::post('/saveSubjects', [StudentController::class, 'saveSubjects'])->name('saveSubjects');

    Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/getBlockSection', [EnrollmentController::class, 'getBlockSection'])->name('getBlockSection');
    Route::post('/getFreeSection', [EnrollmentController::class, 'getFreeSection'])->name('getFreeSection');
    Route::post('/getBlockClassSchedule', [EnrollmentController::class, 'getBlockClassSchedule'])->name('getBlockClassSchedule');
    Route::post('/getFreeClassSchedule', [EnrollmentController::class, 'getFreelassSchedule'])->name('getFreeClassSchedule');
});

require __DIR__.'/auth.php';
