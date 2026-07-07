<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            'customer_id' => User::factory()->customer(),
            'provider_profile_id' => ProviderProfile::factory(),
            'status' => BookingStatus::Pending,
            'description' => fake()->sentence(),
            'address' => fake()->streetAddress(),
            'agreed_price' => 100,
            'payment_method' => 'cash',
            'payment_status' => 'unpaid',
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn () => ['status' => BookingStatus::Accepted]);
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => BookingStatus::Completed, 'payment_status' => 'paid']);
    }
}
