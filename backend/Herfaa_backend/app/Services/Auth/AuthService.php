<?php

namespace App\Services\Auth;

use App\Enums\ApprovalStatus;
use App\Enums\PriceUnit;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Business logic for authentication. Keeps controllers thin: they validate
 * and shape responses; this layer owns the rules (lookup, suspension, tokens).
 */
class AuthService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function register(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'], // hashed via the model cast
            'role' => $data['role'],
            'status' => UserStatus::Active,
            'city' => $data['city'] ?? null,
        ]);

        // No email-verification step — the account is active immediately.
        $user->forceFill(['email_verified_at' => now()])->save();

        // A provider gets a pending profile immediately so the admin has
        // something to review and the provider has a profile to complete.
        if ($user->isProvider()) {
            $user->providerProfile()->create([
                'approval_status' => ApprovalStatus::Pending,
                'price_unit' => PriceUnit::Visit,
                'city' => $data['city'] ?? null,
            ]);
        }

        return $user;
    }

    /**
     * @return array{user: User, token: string}
     */
    public function login(string $login, string $password): array
    {
        $user = User::where('email', $login)->orWhere('phone', $login)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['بيانات تسجيل الدخول غير صحيحة.'],
            ]);
        }

        if ($user->isSuspended()) {
            throw ValidationException::withMessages([
                'login' => ['تم إيقاف هذا الحساب. يرجى التواصل مع الدعم.'],
            ]);
        }

        return [
            'user' => $user,
            'token' => $user->createToken('herfaa-spa')->plainTextToken,
        ];
    }
}
