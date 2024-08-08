<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'IdNumber' => ['required', 'string'],
            'password' => ['required', 'string'],
            'campus' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();
        $csrfToken=$this->header('x-xsrf-token');
        $data = [
            'username' => '2015-21713',
            'password' =>   'portal@SDMD123',
            'campusID' => 1,
        ];
        $response = Http::withHeaders([
            'X-CSRF-TOKEN' => $csrfToken,
            'Content-Type' => 'application/json',
        ])->post("https://api.usep.edu.ph/user/auth", $data);
        $data=$response->json();
        if($data["success"]==true){
            $url="https://api.usep.edu.ph/student/getProfile/".$data['user']."/1";
            $result = Http::withHeaders([
                'Authorization' => $data['token'],
                'X-CSRF-TOKEN' => $csrfToken,
                'Content-Type' => 'application/json',
            ])->get($url);
            $res=$result->json();
            // $user = User::where('UserID', $data['id'])->first();
            // if($user){
            //     Auth::login($user);
            // }else{
            //     $user = User::create([
            //         'UserID' => $data['id'],
            //         'email' => $data['Email'],
            //         'password' => Hash::make('sss'),
            //     ]);
            // }      
            // Auth::login($user);
            // RateLimiter::clear($this->throttleKey());
        }else{
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'UserID' => trans('auth.failed'),
            ]);
        }
    }

    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();
    //     $user = Auth::attempt(['UserID'=>'UserID', 'password'=>'password']);

    //     if (!$user) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'UserID' => trans('auth.failed'),
    //         ]);
    //     }

    //     Auth::login($user, $this->boolean('remember'));

    //     RateLimiter::clear($this->throttleKey());
    // }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'name' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('name')).'|'.$this->ip());
    }
}
