<?php

namespace App\Http\Controllers\Api\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\ProviderSearchRequest;
use App\Http\Requests\Provider\SyncSkillsRequest;
use App\Http\Requests\Provider\UpdateProviderProfileRequest;
use App\Http\Resources\Provider\ProviderCardResource;
use App\Http\Resources\Provider\ProviderResource;
use App\Models\ProviderProfile;
use App\Services\Provider\ProviderProfileService;
use App\Services\Provider\ProviderSearchService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProviderProfileController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProviderProfileService $service,
        private readonly ProviderSearchService $search,
    ) {}

    /** Public provider search — filters: q, category_id, city, min_rating, price, sort. */
    public function index(ProviderSearchRequest $request)
    {
        $paginator = $this->search->search($request->validated());

        return $this->success([
            'items' => ProviderCardResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'OK');
    }

    /** The authenticated provider's own profile (any approval status). */
    public function showMine(Request $request)
    {
        $profile = $request->user()->providerProfile()
            ->with(['user', 'category', 'skills', 'services.category', 'portfolioItems'])
            ->firstOrFail();

        return $this->success(new ProviderResource($profile), 'OK');
    }

    public function update(UpdateProviderProfileRequest $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();
        $this->service->update($profile, $request->validated());
        $profile->load(['user', 'category', 'skills', 'services.category', 'portfolioItems']);

        return $this->success(new ProviderResource($profile), 'تم تحديث الملف الشخصي.');
    }

    public function syncSkills(SyncSkillsRequest $request)
    {
        $profile = $request->user()->providerProfile()->firstOrFail();
        $this->service->syncSkills($profile, $request->validated()['skills']);
        $profile->load('skills');

        return $this->success(
            $profile->skills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            'تم تحديث المهارات.'
        );
    }

    /** Public profile — only approved providers are visible to outsiders. */
    public function show(Request $request, ProviderProfile $providerProfile)
    {
        $viewer = $request->user();
        $isOwnerOrAdmin = $viewer && ($viewer->id === $providerProfile->user_id || $viewer->isAdmin());

        if (! $providerProfile->isApproved() && ! $isOwnerOrAdmin) {
            abort(404);
        }

        $providerProfile->load([
            'user', 'category', 'skills', 'portfolioItems',
            'services' => fn ($q) => $q->where('is_active', true)->with('category'),
        ]);

        return $this->success(new ProviderResource($providerProfile), 'OK');
    }
}
