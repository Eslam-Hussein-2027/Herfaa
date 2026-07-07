<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Provider\ProviderCardResource;
use App\Models\ProviderProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $providers = $request->user()->wishlistProviders()
            ->with(['user', 'category'])
            ->orderByDesc('rating_avg')
            ->get();

        return $this->success(ProviderCardResource::collection($providers), 'OK');
    }

    public function store(Request $request, ProviderProfile $providerProfile)
    {
        // firstOrCreate + the unique index keep this idempotent (no duplicates).
        $request->user()->wishlists()->firstOrCreate([
            'provider_profile_id' => $providerProfile->id,
        ]);

        return $this->success(null, 'تمت الإضافة إلى المفضّلة.', 201);
    }

    public function destroy(Request $request, ProviderProfile $providerProfile)
    {
        $request->user()->wishlists()
            ->where('provider_profile_id', $providerProfile->id)
            ->delete();

        return $this->success(null, 'تمت الإزالة من المفضّلة.');
    }
}
