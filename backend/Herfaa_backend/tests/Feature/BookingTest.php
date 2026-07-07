<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\User;
use App\Notifications\NewBookingRequestNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_booking_and_provider_is_notified(): void
    {
        Notification::fake();
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        Sanctum::actingAs($customer);

        $this->postJson('/api/v1/bookings', ['provider_id' => $provider->id, 'description' => 'fix the door'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending');

        Notification::assertSentTo($provider->user, NewBookingRequestNotification::class);
    }

    public function test_cannot_book_unapproved_provider(): void
    {
        $provider = ProviderProfile::factory()->pending()->create();
        Sanctum::actingAs(User::factory()->customer()->create());

        $this->postJson('/api/v1/bookings', ['provider_id' => $provider->id, 'description' => 'x'])
            ->assertStatus(422);
    }

    public function test_provider_can_advance_full_lifecycle(): void
    {
        Notification::fake();
        $provider = ProviderProfile::factory()->create();
        $booking = Booking::factory()->create(['provider_profile_id' => $provider->id]);
        Sanctum::actingAs($provider->user);

        $this->postJson("/api/v1/bookings/{$booking->id}/accept")->assertOk()->assertJsonPath('data.status', 'accepted');
        $this->postJson("/api/v1/bookings/{$booking->id}/start")->assertOk()->assertJsonPath('data.status', 'in_progress');
        $this->postJson("/api/v1/bookings/{$booking->id}/complete")->assertOk()->assertJsonPath('data.status', 'completed');
    }

    public function test_invalid_transition_is_rejected(): void
    {
        $provider = ProviderProfile::factory()->create();
        $booking = Booking::factory()->create(['provider_profile_id' => $provider->id]); // pending
        Sanctum::actingAs($provider->user);

        // Cannot complete a pending booking.
        $this->postJson("/api/v1/bookings/{$booking->id}/complete")->assertStatus(422);
    }

    public function test_customer_cannot_accept_booking(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]);
        Sanctum::actingAs($customer);

        $this->postJson("/api/v1/bookings/{$booking->id}/accept")->assertForbidden();
    }

    public function test_phone_is_hidden_until_accepted(): void
    {
        $provider = ProviderProfile::factory()->create();
        $customer = User::factory()->customer()->create();
        $booking = Booking::factory()->create([
            'provider_profile_id' => $provider->id,
            'customer_id' => $customer->id,
        ]);

        Sanctum::actingAs($customer);
        $this->getJson("/api/v1/bookings/{$booking->id}")->assertJsonPath('data.provider.phone', null);

        Sanctum::actingAs($provider->user);
        $this->postJson("/api/v1/bookings/{$booking->id}/accept");

        Sanctum::actingAs($customer);
        $this->getJson("/api/v1/bookings/{$booking->id}")
            ->assertJsonPath('data.provider.phone', $provider->user->phone);
    }
}
