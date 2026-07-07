<?php

namespace App\Http\Resources\Customer;

use App\Enums\BookingStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        // Phone numbers are hidden until the booking is accepted (privacy rule).
        $revealed = in_array($this->status, [
            BookingStatus::Accepted,
            BookingStatus::InProgress,
            BookingStatus::Completed,
        ], true);

        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'description' => $this->description,
            'address' => $this->address,
            'scheduled_at' => $this->scheduled_at,
            'agreed_price' => $this->agreed_price !== null ? (float) $this->agreed_price : null,
            'status_reason' => $this->status_reason,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'reviewed' => $this->review !== null,
            'created_at' => $this->created_at,

            'service' => $this->whenLoaded('service', fn () => $this->service ? [
                'id' => $this->service->id,
                'title' => $this->service->title,
            ] : null),

            'provider' => $this->whenLoaded('provider', fn () => [
                'id' => $this->provider->id,
                'name' => $this->provider->user?->name,
                'headline' => $this->provider->headline,
                'city' => $this->provider->city,
                'phone' => $revealed ? $this->provider->user?->phone : null,
            ]),

            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer->id,
                'name' => $this->customer->name,
                'city' => $this->customer->city,
                'phone' => $revealed ? $this->customer->phone : null,
            ]),
        ];
    }
}
