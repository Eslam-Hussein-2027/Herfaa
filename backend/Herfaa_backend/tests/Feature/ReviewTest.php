<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_review_incomplete_booking(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]); // pending
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/bookings/{$booking->id}/review", ['rating' => 5])->assertStatus(422);
    }

    public function test_review_completed_booking_recalculates_rating(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->completed()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]);
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/bookings/{$booking->id}/review", ['rating' => 4, 'comment' => 'good'])
            ->assertCreated();

        $provider->refresh();
        $this->assertEquals(4.0, (float) $provider->rating_avg);
        $this->assertEquals(1, $provider->rating_count);
    }

    public function test_cannot_review_same_booking_twice(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->completed()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]);
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/bookings/{$booking->id}/review", ['rating' => 5])->assertCreated();
        $this->postJson("/api/v1/bookings/{$booking->id}/review", ['rating' => 5])->assertStatus(422);
    }
}
