<?php

namespace App\Http\Requests\Provider;

use App\Enums\PriceUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_unit' => ['required', Rule::enum(PriceUnit::class)],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
