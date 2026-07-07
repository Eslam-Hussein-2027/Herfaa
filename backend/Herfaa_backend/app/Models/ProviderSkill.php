<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderSkill extends Model
{
    protected $fillable = ['provider_profile_id', 'name'];

    public function provider()
    {
        return $this->belongsTo(ProviderProfile::class, 'provider_profile_id');
    }
}
