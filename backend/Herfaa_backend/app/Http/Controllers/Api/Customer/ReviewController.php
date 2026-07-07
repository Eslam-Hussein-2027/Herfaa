<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreReviewRequest;
use App\Http\Resources\Customer\ReviewResource;
use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Services\Customer\ReviewService;
use App\Traits\ApiResponse;

class ReviewController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ReviewService $service) {}

    public function store(StoreReviewRequest $request, Booking $booking)
    {
        if ($booking->customer_id !== $request->user()->id) {
            abort(403);
        }

        $review = $this->service->createForBooking($booking, $request->validated());

        return $this->success(new ReviewResource($review->load('customer')), 'شكراً لتقييمك!', 201);
    }

    /** Public — a provider's visible reviews. */
    public function providerReviews(ProviderProfile $providerProfile)
    {
        $reviews = $providerProfile->reviews()
            ->where('status', ReviewStatus::Visible)
            ->with('customer')
            ->latest()
            ->get();

        return $this->success(ReviewResource::collection($reviews), 'OK');
    }
}
