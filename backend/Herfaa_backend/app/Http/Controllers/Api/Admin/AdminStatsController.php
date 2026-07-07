<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ApprovalStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Category;
use App\Models\ProviderProfile;
use App\Models\Review;
use App\Models\User;
use App\Traits\ApiResponse;

class AdminStatsController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success([
            'customers' => User::where('role', UserRole::Customer)->count(),
            'providers' => User::where('role', UserRole::Provider)->count(),
            'pending_providers' => ProviderProfile::where('approval_status', ApprovalStatus::Pending)->count(),
            'total_bookings' => Booking::count(),
            'total_reviews' => Review::count(),
            'categories' => Category::count(),
        ], 'OK');
    }
}
