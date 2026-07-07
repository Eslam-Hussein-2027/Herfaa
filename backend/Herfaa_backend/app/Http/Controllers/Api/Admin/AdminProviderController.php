<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectProviderRequest;
use App\Http\Resources\Admin\ProviderAdminResource;
use App\Models\ProviderProfile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminProviderController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = ProviderProfile::query()->with(['user', 'category'])->latest();

        if ($status = $request->query('status')) {
            $query->where('approval_status', $status);
        }

        return $this->paginated($query->paginate(15), ProviderAdminResource::class);
    }

    public function approve(ProviderProfile $providerProfile)
    {
        $providerProfile->update(['approval_status' => ApprovalStatus::Approved, 'rejection_reason' => null]);

        return $this->respond($providerProfile, 'تم اعتماد الحِرفي.');
    }

    public function reject(RejectProviderRequest $request, ProviderProfile $providerProfile)
    {
        $reason = $request->validated()['reason'];
        $providerProfile->update(['approval_status' => ApprovalStatus::Rejected, 'rejection_reason' => $reason]);

        return $this->respond($providerProfile, 'تم رفض الحِرفي.');
    }

    public function suspend(ProviderProfile $providerProfile)
    {
        $providerProfile->update(['approval_status' => ApprovalStatus::Suspended]);

        return $this->respond($providerProfile, 'تم إيقاف الحِرفي.');
    }

    private function respond(ProviderProfile $providerProfile, string $message)
    {
        return $this->success(
            new ProviderAdminResource($providerProfile->load(['user', 'category'])),
            $message
        );
    }
}
