<?php

namespace App\Models;

use App\Enums\ApprovalStatus;
use App\Enums\PriceUnit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'category_id', 'headline', 'bio', 'address',
        'city', 'base_price', 'price_unit', 'approval_status', 'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'price_unit' => PriceUnit::class,
            'approval_status' => ApprovalStatus::class,
            'base_price' => 'decimal:2',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function isApproved(): bool
    {
        return $this->approval_status === ApprovalStatus::Approved;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function skills()
    {
        return $this->hasMany(ProviderSkill::class);
    }

    public function portfolioItems()
    {
        return $this->hasMany(PortfolioItem::class)->orderBy('sort_order');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
