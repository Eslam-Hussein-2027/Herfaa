<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Traits\ApiResponse;

class FaqController extends Controller
{
    use ApiResponse;

    /** Public — published FAQs. */
    public function index()
    {
        $faqs = Faq::where('is_published', true)->orderBy('sort_order')->get();

        return $this->success(FaqResource::collection($faqs), 'OK');
    }
}
