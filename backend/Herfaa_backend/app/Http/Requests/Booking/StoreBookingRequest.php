<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'provider_id' => ['required', 'integer', 'exists:provider_profiles,id'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'scheduled_at' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
        ];
    }
}
