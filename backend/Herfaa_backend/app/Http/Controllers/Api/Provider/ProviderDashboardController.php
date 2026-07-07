<?php

namespace App\Http\Controllers\Api\Provider;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Customer\BookingResource;
use App\Services\Provider\ProviderAnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProviderDashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ProviderAnalyticsService $analytics) {}

    /** Everything the provider dashboard needs in one call. */
    public function index(Request $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();

        $pending = $profile->bookings()
            ->where('status', BookingStatus::Pending)
            ->with(['service', 'customer', 'review'])
            ->latest()
            ->limit(6)
            ->get();

        $active = $profile->bookings()
            ->whereIn('status', [BookingStatus::Accepted, BookingStatus::InProgress])
            ->with(['service', 'customer', 'review'])
            ->latest()
            ->limit(6)
            ->get();

        return $this->success([
            'stats' => $this->analytics->forProvider($profile),
            'pending' => BookingResource::collection($pending),
            'active' => BookingResource::collection($active),
        ], 'OK');
    }
}
