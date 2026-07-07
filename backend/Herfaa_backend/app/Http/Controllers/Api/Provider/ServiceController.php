<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\ServiceRequest;
use App\Http\Resources\Provider\ServiceResource;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();
        $services = $profile->services()->with('category')->latest()->get();

        return $this->success(ServiceResource::collection($services), 'OK');
    }

    public function store(ServiceRequest $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();

        $data = $request->validated();
        if (! array_key_exists('is_active', $data)) {
            $data['is_active'] = true;
        }

        $service = $profile->services()->create($data);

        return $this->success(new ServiceResource($service->load('category')), 'تم إضافة الخدمة.', 201);
    }

    public function update(ServiceRequest $request, Service $service)
    {
        $this->authorize('update', $service);
        $service->update($request->validated());

        return $this->success(new ServiceResource($service->load('category')), 'تم تحديث الخدمة.');
    }

    public function destroy(Request $request, Service $service)
    {
        $this->authorize('delete', $service);
        $service->delete();

        return $this->success(null, 'تم حذف الخدمة.');
    }
}
