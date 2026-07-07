<?php

namespace App\Models;

use App\Enums\PriceUnit;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'provider_profile_id', 'category_id', 'title', 'description', 'price', 'price_unit', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_unit' => PriceUnit::class,
            'is_active' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function provider()
    {
        return $this->belongsTo(ProviderProfile::class, 'provider_profile_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
