<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin(): void
    {
        Sanctum::actingAs(User::factory()->customer()->create());

        $this->getJson('/api/v1/admin/stats')->assertForbidden();
    }

    public function test_admin_can_approve_provider(): void
    {
        $provider = ProviderProfile::factory()->pending()->create();
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson("/api/v1/admin/providers/{$provider->id}/approve")->assertOk();

        $this->assertDatabaseHas('provider_profiles', [
            'id' => $provider->id,
            'approval_status' => 'approved',
        ]);
    }

    public function test_hiding_a_review_recalculates_rating(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->completed()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]);

        Sanctum::actingAs($customer);
        $this->postJson("/api/v1/bookings/{$booking->id}/review", ['rating' => 5])->assertCreated();
        $provider->refresh();
        $this->assertEquals(1, $provider->rating_count);

        $review = $provider->reviews()->first();
        Sanctum::actingAs(User::factory()->admin()->create());
        $this->patchJson("/api/v1/admin/reviews/{$review->id}/moderate", ['status' => 'hidden'])->assertOk();

        $provider->refresh();
        $this->assertEquals(0, $provider->rating_count);
    }
}
