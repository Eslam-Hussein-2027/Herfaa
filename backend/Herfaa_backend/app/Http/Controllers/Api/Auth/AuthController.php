<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $auth) {}

    public function register(RegisterRequest $request)
    {
        $user = $this->auth->register($request->validated());

        return $this->success([
            'user' => new UserResource($user),
            'token' => $user->createToken('herfaa-spa')->plainTextToken,
        ], 'تم إنشاء حسابك. تحقّق من بريدك الإلكتروني لتفعيله.', 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        $result = $this->auth->login($data['login'], $data['password']);

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'تم تسجيل الدخول بنجاح.');
    }

    public function me(Request $request)
    {
        return $this->success(new UserResource($request->user()), 'OK');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'تم تسجيل الخروج بنجاح.');
    }
}
