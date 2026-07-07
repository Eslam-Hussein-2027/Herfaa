<?php

namespace App\Services\Customer;

use App\Enums\BookingStatus;
use App\Enums\ReviewStatus;
use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\Review;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function createForBooking(Booking $booking, array $data): Review
    {
        if ($booking->status !== BookingStatus::Completed) {
            throw ValidationException::withMessages([
                'booking' => ['لا يمكن التقييم إلا بعد إنجاز الطلب.'],
            ]);
        }

        if ($booking->review()->exists()) {
            throw ValidationException::withMessages([
                'booking' => ['لقد قمت بتقييم هذا الطلب مسبقاً.'],
            ]);
        }

        $review = $booking->review()->create([
            'customer_id' => $booking->customer_id,
            'provider_profile_id' => $booking->provider_profile_id,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
            'status' => ReviewStatus::Visible,
        ]);

        $this->recalculateRating($booking->provider);

        return $review;
    }

    /**
     * Recompute a provider's cached rating from its visible reviews.
     * Public so admin moderation (hide/unhide) can reuse it.
     */
    public function recalculateRating(ProviderProfile $provider): void
    {
        $agg = $provider->reviews()
            ->where('status', ReviewStatus::Visible)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as cnt')
            ->first();

        $provider->forceFill([
            'rating_avg' => round((float) ($agg->avg_rating ?? 0), 2),
            'rating_count' => (int) ($agg->cnt ?? 0),
        ])->save();
    }
}
