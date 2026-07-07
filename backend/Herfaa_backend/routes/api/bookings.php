<?php

use App\Http\Controllers\Api\Customer\BookingController;
use Illuminate\Support\Facades\Route;

/*
| Module 4 — Booking Request System  (mounted under /api/v1)
| All routes require a verified, authenticated user.
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('bookings', [BookingController::class, 'index']);
    Route::get('bookings/{booking}', [BookingController::class, 'show']);

    // Customer
    Route::post('bookings', [BookingController::class, 'store'])->middleware('role:customer');
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    // Provider transitions (authorized per-booking via BookingPolicy::manage)
    Route::post('bookings/{booking}/accept', [BookingController::class, 'accept']);
    Route::post('bookings/{booking}/reject', [BookingController::class, 'reject']);
    Route::post('bookings/{booking}/start', [BookingController::class, 'start']);
    Route::post('bookings/{booking}/complete', [BookingController::class, 'complete']);
});
