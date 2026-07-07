<?php

use App\Http\Controllers\Api\Customer\WishlistController;
use Illuminate\Support\Facades\Route;

/*
| Module 5 — Wishlist (Favorites)  (mounted under /api/v1)
*/

Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('wishlist', [WishlistController::class, 'index']);
    Route::post('wishlist/{providerProfile}', [WishlistController::class, 'store']);
    Route::delete('wishlist/{providerProfile}', [WishlistController::class, 'destroy']);
});
