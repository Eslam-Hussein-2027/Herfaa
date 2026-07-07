<?php

namespace App\Http\Resources\Auth;

use App\Enums\UserRole;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'home_path' => match ($this->role) {
                UserRole::Provider => '/provider',
                UserRole::Admin => '/admin',
                default => '/',
            },
            'status' => $this->status->value,
            'provider_id' => $this->when($this->isProvider(), fn () => $this->providerProfile?->id),
            'email_verified' => $this->hasVerifiedEmail(),
            'avatar_url' => $this->avatar_path ? asset('storage/'.$this->avatar_path) : null,
            'created_at' => $this->created_at,
        ];
    }
}
