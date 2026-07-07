<?php

namespace App\Http\Resources\Provider;

use Illuminate\Http\Resources\Json\JsonResource;

/** Lightweight provider representation for lists / cards. */
class ProviderCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user?->name,
            'avatar_url' => $this->user?->avatar_path ? asset('storage/'.$this->user->avatar_path) : null,
            'headline' => $this->headline,
            'city' => $this->city,
            'rating_avg' => (float) $this->rating_avg,
            'rating_count' => $this->rating_count,
            'base_price' => $this->base_price !== null ? (float) $this->base_price : null,
            'price_unit' => $this->price_unit?->value,
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name_ar' => $this->category->name_ar,
                'icon' => $this->category->icon,
            ] : null),
        ];
    }
}
