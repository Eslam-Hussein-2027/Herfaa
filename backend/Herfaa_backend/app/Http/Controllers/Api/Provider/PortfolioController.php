<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\StorePortfolioRequest;
use App\Http\Resources\Provider\PortfolioItemResource;
use App\Models\PortfolioItem;
use App\Services\Provider\PortfolioService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly PortfolioService $service) {}

    public function index(Request $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();

        return $this->success(PortfolioItemResource::collection($profile->portfolioItems()->get()), 'OK');
    }

    public function store(StorePortfolioRequest $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();
        $item = $this->service->store($profile, $request->file('image'), $request->input('caption'));

        return $this->success(new PortfolioItemResource($item), 'تم رفع الصورة.', 201);
    }

    public function destroy(Request $request, PortfolioItem $portfolioItem)
    {
        $this->authorize('delete', $portfolioItem);
        $this->service->delete($portfolioItem);

        return $this->success(null, 'تم حذف الصورة.');
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer'],
        ]);
        $profile = $request->user()->providerProfile()->firstOrFail();
        $this->service->reorder($profile, $data['order']);

        return $this->success(null, 'تم إعادة الترتيب.');
    }
}
