<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewAdminResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'status' => $this->status->value,
            'customer_name' => $this->customer?->name,
            'provider_name' => $this->provider?->user?->name,
            'created_at' => $this->created_at,
        ];
    }
}
