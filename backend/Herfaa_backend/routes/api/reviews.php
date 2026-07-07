<?php

use App\Http\Controllers\Api\Customer\ReviewController;
use Illuminate\Support\Facades\Route;

/*
| Module 6 — Reviews & Ratings  (mounted under /api/v1)
*/

// Public
Route::get('providers/{providerProfile}/reviews', [ReviewController::class, 'providerReviews']);

// Customer leaves one review per completed booking
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('bookings/{booking}/review', [ReviewController::class, 'store']);
});
