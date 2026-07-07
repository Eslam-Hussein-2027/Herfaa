<?php

namespace Tests\Feature;

use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_add_and_remove_favorite(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/wishlist/{$provider->id}")->assertCreated();
        $this->assertDatabaseHas('wishlists', [
            'customer_id' => $customer->id,
            'provider_profile_id' => $provider->id,
        ]);

        $this->deleteJson("/api/v1/wishlist/{$provider->id}")->assertOk();
        $this->assertDatabaseMissing('wishlists', [
            'customer_id' => $customer->id,
            'provider_profile_id' => $provider->id,
        ]);
    }

    public function test_duplicate_favorite_is_idempotent(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/wishlist/{$provider->id}");
        $this->postJson("/api/v1/wishlist/{$provider->id}");

        $this->assertEquals(1, $customer->wishlists()->count());
    }

    public function test_provider_cannot_use_wishlist(): void
    {
        $provider = ProviderProfile::factory()->create();
        Sanctum::actingAs($provider->user);

        $this->getJson('/api/v1/wishlist')->assertForbidden();
    }
}
