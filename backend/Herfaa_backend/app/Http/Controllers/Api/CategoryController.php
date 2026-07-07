<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return $this->success(CategoryResource::collection($categories), 'OK');
    }
}
