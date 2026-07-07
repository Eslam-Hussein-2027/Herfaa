<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ModerateReviewRequest;
use App\Http\Resources\Admin\ReviewAdminResource;
use App\Models\Review;
use App\Services\Customer\ReviewService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ReviewService $reviews) {}

    public function index(Request $request)
    {
        $query = Review::query()->with(['customer', 'provider.user'])->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return $this->paginated($query->paginate(15), ReviewAdminResource::class);
    }

    public function moderate(ModerateReviewRequest $request, Review $review)
    {
        $review->update(['status' => $request->validated()['status']]);
        // Rating reflects only visible reviews.
        $this->reviews->recalculateRating($review->provider);

        return $this->success(
            new ReviewAdminResource($review->load(['customer', 'provider.user'])),
            'تم تحديث حالة التقييم.'
        );
    }
}
