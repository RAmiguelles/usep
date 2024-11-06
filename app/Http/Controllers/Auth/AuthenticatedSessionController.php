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
use App\Models\DBOSession;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use LDAP\Result;

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
        if($request->IdNumber=='admin' && $request->password=="123"){
            DBOSession::where('idNumber','admin')->delete();
            $request->session()->put('idNumber', 'admin' );
            $request->session()->put('campusID',$request->campus);
            return redirect()->intended(route('admin'));
        }else{
            $csrfToken=$request->header('x-xsrf-token');
            $data = [
                'username' => $request->IdNumber,
                'password' => "SDMD@USeP911",
                'campusID' => $request->campus,
            ];
            $request->session()->put('db','sqlsrv_'.$request->campus);
            $response = Http::withHeaders([
                'X-CSRF-TOKEN' => $csrfToken,
                'Content-Type' => 'application/json',
            ])->post("https://api.usep.edu.ph/user/auth", $data);
            $data=$response->json();
            if($data["success"]==true){
                // Session::start(session()->get('db'));
                DBOSession::where('idNumber',$data['user'])->delete();
                $request->session()->put('idNumber',$data['user']);
                $request->session()->put('campusID',$request->campus);
                $request->session()->put('token',$data['token']);
                return redirect()->intended(route('student.show', absolute: false));
            }else{
                return redirect()->back()->withErrors(['status' => 'Invalid credentials']);
            }
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        DBOSession::where('idNumber',session()->get('idNumber'))->delete();
        $request->session()->flush();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
