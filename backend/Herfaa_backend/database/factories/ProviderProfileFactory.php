<?php

namespace Database\Factories;

use App\Enums\ApprovalStatus;
use App\Enums\PriceUnit;
use App\Models\Category;
use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProviderProfile>
 */
class ProviderProfileFactory extends Factory
{
    protected $model = ProviderProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->provider(),
            'category_id' => Category::factory(),
            'headline' => fake()->sentence(3),
            'bio' => fake()->paragraph(),
            'city' => 'طرابلس',
            'base_price' => 50,
            'price_unit' => PriceUnit::Visit,
            'approval_status' => ApprovalStatus::Approved,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['approval_status' => ApprovalStatus::Pending]);
    }
}
