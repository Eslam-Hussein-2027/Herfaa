<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Traits\ApiResponse;

class AdminFaqController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(FaqResource::collection(Faq::orderBy('sort_order')->get()), 'OK');
    }

    public function store(FaqRequest $request)
    {
        $data = $request->validated();
        $data['is_published'] = $request->boolean('is_published', true);

        $faq = Faq::create($data);

        return $this->success(new FaqResource($faq), 'تمت الإضافة.', 201);
    }

    public function update(FaqRequest $request, Faq $faq)
    {
        $faq->update($request->validated());

        return $this->success(new FaqResource($faq), 'تم التحديث.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return $this->success(null, 'تم الحذف.');
    }
}
