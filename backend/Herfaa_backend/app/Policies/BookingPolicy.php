<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /** Customer, the owning provider, or an admin may view. */
    public function view(User $user, Booking $booking): bool
    {
        return $user->id === $booking->customer_id
            || $user->id === $booking->provider->user_id
            || $user->isAdmin();
    }

    /** Provider-side actions (accept/reject/start/complete). */
    public function manage(User $user, Booking $booking): bool
    {
        return $user->id === $booking->provider->user_id;
    }

    /** Only the customer may cancel their own booking. */
    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->customer_id;
    }
}
