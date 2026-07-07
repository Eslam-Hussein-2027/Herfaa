<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Herfaa API Routes (v1)
|--------------------------------------------------------------------------
| All endpoints are prefixed with /api/v1. Auth uses Laravel Sanctum
| (Bearer tokens). Responses follow the { data, message, errors } envelope.
*/

Route::prefix('v1')->group(function () {
    // Health check — confirms the API is wired and reachable.
    Route::get('/ping', function () {
        return response()->json([
            'data' => ['status' => 'ok', 'service' => 'Herfaa API', 'version' => 'v1'],
            'message' => 'pong',
            'errors' => null,
        ]);
    });

    // Module routes are registered here as each module is built:
    require __DIR__.'/api/auth.php';           // Module 1 — Authentication
    require __DIR__.'/api/providers.php';      // Module 2 & 3 — Providers, search
    require __DIR__.'/api/bookings.php';       // Module 4 — Bookings
    require __DIR__.'/api/wishlist.php';       // Module 5 — Wishlist
    require __DIR__.'/api/reviews.php';        // Module 6 — Reviews & Ratings
    require __DIR__.'/api/admin.php';          // Module 8 — Admin + public FAQ
});
