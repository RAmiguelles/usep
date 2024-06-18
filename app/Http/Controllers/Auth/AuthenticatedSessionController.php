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
        $csrfToken = $request->header('x-xsrf-token');
        // $request->authenticate();
        $data = [
            'pmaps_id' => $request->UserID,
            'password' => $request->password,
            'token' => 'a3fbd181665bcbc428be0c1412366979',
        ];
        $response = Http::withHeaders([
            'X-CSRF-TOKEN' => $csrfToken,
            'Content-Type' => 'application/json',
        ])->post("https://hris.usep.edu.ph/api/auth/login", $data);
        $data=$response->json();
        if(!$data["Error"]){
            $user = User::where('UserID', $data['id'])->first();
            if($user){
                Auth::login($user);
            }else{
                $user = User::create([
                    'UserID' => $data['id'],
                    'email' => $data['Email'],
                    'password' => Hash::make($request->input('sss')),
                ]);
            }      
            Auth::login($user);
            return redirect()->intended(route('dashboard', absolute: false));
        }
        return redirect()->back();
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
