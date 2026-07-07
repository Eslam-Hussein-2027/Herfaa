<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_with_active_account(): void
    {
        $this->postJson('/api/v1/register', [
            'name' => 'Test',
            'email' => 't@x.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'customer',
        ])->assertCreated()->assertJsonPath('data.user.role', 'customer');

        $this->assertDatabaseHas('users', ['email' => 't@x.com', 'role' => 'customer']);
        // No verification step — the account is active immediately.
        $this->assertNotNull(User::whereEmail('t@x.com')->first()->email_verified_at);
    }

    public function test_provider_registration_creates_pending_profile(): void
    {
        $this->postJson('/api/v1/register', [
            'name' => 'P',
            'email' => 'p@x.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'provider',
        ])->assertCreated();

        $user = User::whereEmail('p@x.com')->first();
        $this->assertDatabaseHas('provider_profiles', [
            'user_id' => $user->id,
            'approval_status' => 'pending',
        ]);
    }

    public function test_login_returns_token(): void
    {
        User::factory()->create(['email' => 'a@x.com']);

        $this->postJson('/api/v1/login', ['login' => 'a@x.com', 'password' => 'password'])
            ->assertOk()
            ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_login_with_invalid_credentials_fails(): void
    {
        User::factory()->create(['email' => 'a@x.com']);

        $this->postJson('/api/v1/login', ['login' => 'a@x.com', 'password' => 'wrong'])
            ->assertStatus(422);
    }

    public function test_suspended_user_cannot_login(): void
    {
        User::factory()->suspended()->create(['email' => 's@x.com']);

        $this->postJson('/api/v1/login', ['login' => 's@x.com', 'password' => 'password'])
            ->assertStatus(422);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/v1/me')->assertUnauthorized();
    }
}
