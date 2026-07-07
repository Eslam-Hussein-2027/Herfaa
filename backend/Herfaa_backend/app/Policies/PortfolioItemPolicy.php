<?php

namespace App\Policies;

use App\Models\PortfolioItem;
use App\Models\User;

class PortfolioItemPolicy
{
    public function delete(User $user, PortfolioItem $item): bool
    {
        return $item->provider->user_id === $user->id;
    }
}
