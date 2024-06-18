<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ES_StudentsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::resource('students',ES_StudentsController::class);
Route::post('/getBlockClassSchedule', [EnrollmentController::class, 'getBlockClassSchedule'])->name('getBlockClassSchedule');
Route::post('/getFreeClassSchedule', [EnrollmentController::class, 'getFreelassSchedule'])->name('getFreeClassSchedule');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        // 'canRegister' => Route::has('register')
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/enrollment', [EnrollmentController::class, 'index'])->name('enrollment.index');
});

require __DIR__.'/auth.php';
