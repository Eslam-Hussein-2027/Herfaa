<?php

namespace App\Services\Provider;

use App\Enums\ApprovalStatus;
use App\Enums\UserStatus;
use App\Models\ProviderProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProviderSearchService
{
    /**
     * Search visible (approved + active) providers with optional filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function search(array $filters): LengthAwarePaginator
    {
        $query = ProviderProfile::query()
            ->where('approval_status', ApprovalStatus::Approved)
            ->whereHas('user', fn ($q) => $q->where('status', UserStatus::Active))
            ->with(['user', 'category']);

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (isset($filters['min_rating'])) {
            $query->where('rating_avg', '>=', $filters['min_rating']);
        }

        if (isset($filters['min_price'])) {
            $query->where('base_price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('base_price', '<=', $filters['max_price']);
        }

        if (! empty($filters['q'])) {
            $term = $filters['q'];
            $query->where(function ($w) use ($term) {
                $w->where('headline', 'like', "%{$term}%")
                    ->orWhere('bio', 'like', "%{$term}%")
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('skills', fn ($s) => $s->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('services', fn ($sv) => $sv->where('title', 'like', "%{$term}%"));
            });
        }

        match ($filters['sort'] ?? 'rating') {
            'price_asc' => $query->orderByRaw('base_price IS NULL, base_price asc'),
            'price_desc' => $query->orderByDesc('base_price'),
            'newest' => $query->latest(),
            default => $query->orderByDesc('rating_avg'),
        };

        return $query->paginate($filters['per_page'] ?? 12)->withQueryString();
    }
}
