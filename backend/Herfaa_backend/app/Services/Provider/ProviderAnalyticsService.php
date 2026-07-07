<?php

namespace App\Services\Provider;

use App\Enums\BookingStatus;
use App\Models\ProviderProfile;

class ProviderAnalyticsService
{
    /**
     * @return array<string, mixed>
     */
    public function forProvider(ProviderProfile $provider): array
    {
        $byStatus = $provider->bookings()
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status')
            ->all();

        $count = fn (BookingStatus $s) => (int) ($byStatus[$s->value] ?? 0);

        return [
            'total_bookings' => array_sum($byStatus),
            'completed_bookings' => $count(BookingStatus::Completed),
            'active_bookings' => $count(BookingStatus::Pending)
                + $count(BookingStatus::Accepted)
                + $count(BookingStatus::InProgress),
            'status_breakdown' => [
                'pending' => $count(BookingStatus::Pending),
                'accepted' => $count(BookingStatus::Accepted),
                'in_progress' => $count(BookingStatus::InProgress),
                'completed' => $count(BookingStatus::Completed),
                'rejected' => $count(BookingStatus::Rejected),
                'cancelled' => $count(BookingStatus::Cancelled),
            ],
            'rating_avg' => (float) $provider->rating_avg,
            'rating_count' => $provider->rating_count,
            'services_count' => $provider->services()->count(),
            'portfolio_count' => $provider->portfolioItems()->count(),
        ];
    }
}
