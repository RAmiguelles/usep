<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // $request->authenticate();
        $csrfToken=$request->header('x-xsrf-token');
        $data = [
            // 'username' => $request->IdNumber,
            // 'password' => $request->password,
            'username' => '2015-21713',
            'password' => 'portal@SDMD123',
            'campusID' => $request->campus,
        ];
        $response = Http::withHeaders([
            'X-CSRF-TOKEN' => $csrfToken,
            'Content-Type' => 'application/json',
        ])->post("https://api.usep.edu.ph/user/auth", $data);
        $data=$response->json();
        if($data["success"]==true){
            $user = User::where('studentNo', $data['user'])->first();
            if(!$user){
                $user = User::create([
                    'studentNo' => $data['user'],
                ]);
            }
            Auth::login($user);
            $request->session()->regenerate();
            return redirect()->intended(route('student.show',$data['user'], absolute: false));
        }else{
            return redirect()->back()->withErrors(['status' => 'Invalid credentials']);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
