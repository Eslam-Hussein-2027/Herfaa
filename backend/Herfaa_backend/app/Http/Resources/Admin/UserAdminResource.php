<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAdminResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'city' => $this->city,
            'role' => $this->role->value,
            'status' => $this->status->value,
            'email_verified' => $this->hasVerifiedEmail(),
            'provider_approval' => $this->when(
                $this->isProvider(),
                fn () => $this->providerProfile?->approval_status?->value
            ),
            'created_at' => $this->created_at,
        ];
    }
}
