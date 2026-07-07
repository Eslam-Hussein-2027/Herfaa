<?php

namespace Tests\Feature;

use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listing_shows_only_approved(): void
    {
        ProviderProfile::factory()->create();
        ProviderProfile::factory()->pending()->create();

        $this->getJson('/api/v1/providers')
            ->assertOk()
            ->assertJsonPath('data.meta.total', 1);
    }

    public function test_pending_provider_profile_is_404_publicly(): void
    {
        $p = ProviderProfile::factory()->pending()->create();

        $this->getJson("/api/v1/providers/{$p->id}")->assertNotFound();
    }

    public function test_provider_can_update_own_profile(): void
    {
        $p = ProviderProfile::factory()->create();
        Sanctum::actingAs($p->user);

        $this->putJson('/api/v1/provider/profile', ['headline' => 'New headline', 'price_unit' => 'visit'])
            ->assertOk()
            ->assertJsonPath('data.headline', 'New headline');
    }

    public function test_customer_cannot_access_provider_routes(): void
    {
        Sanctum::actingAs(User::factory()->customer()->create());

        $this->getJson('/api/v1/provider/profile')->assertForbidden();
    }

    public function test_search_filters_by_minimum_rating(): void
    {
        $high = ProviderProfile::factory()->create();
        $high->forceFill(['rating_avg' => 5.0, 'rating_count' => 2])->save();

        $low = ProviderProfile::factory()->create();
        $low->forceFill(['rating_avg' => 2.0, 'rating_count' => 1])->save();

        $this->getJson('/api/v1/providers?min_rating=4')
            ->assertOk()
            ->assertJsonPath('data.meta.total', 1);
    }
}
