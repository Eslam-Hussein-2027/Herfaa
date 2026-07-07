<?php

use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminFaqController;
use App\Http\Controllers\Api\Admin\AdminProviderController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\FaqController;
use Illuminate\Support\Facades\Route;

/*
| Module 8 — Admin Dashboard  (mounted under /api/v1)
*/

// Public FAQ
Route::get('faqs', [FaqController::class, 'index']);

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('stats', [AdminStatsController::class, 'index']);

    // Users (customers & providers)
    Route::get('users', [AdminUserController::class, 'index']);
    Route::post('users/{user}/suspend', [AdminUserController::class, 'suspend']);
    Route::post('users/{user}/activate', [AdminUserController::class, 'activate']);

    // Provider approval queue
    Route::get('providers', [AdminProviderController::class, 'index']);
    Route::post('providers/{providerProfile}/approve', [AdminProviderController::class, 'approve']);
    Route::post('providers/{providerProfile}/reject', [AdminProviderController::class, 'reject']);
    Route::post('providers/{providerProfile}/suspend', [AdminProviderController::class, 'suspend']);

    // Categories
    Route::get('categories', [AdminCategoryController::class, 'index']);
    Route::post('categories', [AdminCategoryController::class, 'store']);
    Route::put('categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy']);

    // Review moderation
    Route::get('reviews', [AdminReviewController::class, 'index']);
    Route::patch('reviews/{review}/moderate', [AdminReviewController::class, 'moderate']);

    // FAQ management
    Route::get('faqs', [AdminFaqController::class, 'index']);
    Route::post('faqs', [AdminFaqController::class, 'store']);
    Route::put('faqs/{faq}', [AdminFaqController::class, 'update']);
    Route::delete('faqs/{faq}', [AdminFaqController::class, 'destroy']);
});
