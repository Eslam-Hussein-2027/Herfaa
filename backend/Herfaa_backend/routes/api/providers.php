<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\Provider\PortfolioController;
use App\Http\Controllers\Api\Provider\ProviderDashboardController;
use App\Http\Controllers\Api\Provider\ProviderProfileController;
use App\Http\Controllers\Api\Provider\ServiceController;
use Illuminate\Support\Facades\Route;

/*
| Module 2 — Provider Profile & Portfolio  (mounted under /api/v1)
*/

// Public
Route::get('categories', [CategoryController::class, 'index']);
Route::get('providers', [ProviderProfileController::class, 'index']);
Route::get('providers/{providerProfile}', [ProviderProfileController::class, 'show']);

// Provider self-service (must be a verified provider)
Route::middleware(['auth:sanctum', 'role:provider'])->group(function () {
    Route::get('provider/dashboard', [ProviderDashboardController::class, 'index']);
    Route::get('provider/profile', [ProviderProfileController::class, 'showMine']);
    Route::put('provider/profile', [ProviderProfileController::class, 'update']);
    Route::put('provider/skills', [ProviderProfileController::class, 'syncSkills']);

    Route::get('provider/services', [ServiceController::class, 'index']);
    Route::post('provider/services', [ServiceController::class, 'store']);
    Route::put('provider/services/{service}', [ServiceController::class, 'update']);
    Route::delete('provider/services/{service}', [ServiceController::class, 'destroy']);

    Route::get('provider/portfolio', [PortfolioController::class, 'index']);
    Route::post('provider/portfolio', [PortfolioController::class, 'store']);
    Route::put('provider/portfolio/reorder', [PortfolioController::class, 'reorder']);
    Route::delete('provider/portfolio/{portfolioItem}', [PortfolioController::class, 'destroy']);
});
