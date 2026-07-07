<?php

namespace App\Http\Resources\Provider;

use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $viewer = $request->user();
        $canSeeInternal = $viewer && ($viewer->id === $this->user_id || $viewer->isAdmin());

        return [
            'id' => $this->id,
            'name' => $this->user?->name,
            'avatar_url' => $this->user?->avatar_path ? asset('storage/'.$this->user->avatar_path) : null,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'city' => $this->city,
            'address' => $this->address,
            'base_price' => $this->base_price !== null ? (float) $this->base_price : null,
            'price_unit' => $this->price_unit?->value,
            'rating_avg' => (float) $this->rating_avg,
            'rating_count' => $this->rating_count,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name_ar' => $this->category->name_ar,
                'icon' => $this->category->icon,
            ] : null),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ])),
            'services' => ServiceResource::collection($this->whenLoaded('services')),
            'portfolio' => PortfolioItemResource::collection($this->whenLoaded('portfolioItems')),

            // Owner/admin only — internal approval state.
            $this->mergeWhen($canSeeInternal, [
                'approval_status' => $this->approval_status?->value,
                'rejection_reason' => $this->rejection_reason,
            ]),
        ];
    }
}
