<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ProviderAdminResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->user?->name,
            'email' => $this->user?->email,
            'phone' => $this->user?->phone,
            'headline' => $this->headline,
            'city' => $this->city,
            'category' => $this->category?->name_ar,
            'approval_status' => $this->approval_status->value,
            'rejection_reason' => $this->rejection_reason,
            'rating_avg' => (float) $this->rating_avg,
            'created_at' => $this->created_at,
        ];
    }
}
