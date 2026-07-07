<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    use ApiResponse;

    /** All categories (including inactive) for management. */
    public function index()
    {
        return $this->success(CategoryResource::collection(Category::orderBy('sort_order')->get()), 'OK');
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name_en']);
        $data['is_active'] = $request->boolean('is_active', true);

        $category = Category::create($data);

        return $this->success(new CategoryResource($category), 'تمت إضافة الفئة.', 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name_en']);
        }

        $category->update($data);

        return $this->success(new CategoryResource($category), 'تم تحديث الفئة.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return $this->success(null, 'تم حذف الفئة.');
    }
}
