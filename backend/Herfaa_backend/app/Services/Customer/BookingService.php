<?php

namespace App\Services\Customer;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use App\Notifications\BookingStatusNotification;
use App\Notifications\NewBookingRequestNotification;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /** Allowed status transitions (from => [allowed to]). */
    private const TRANSITIONS = [
        'pending' => ['accepted', 'rejected', 'cancelled'],
        'accepted' => ['in_progress', 'cancelled'],
        'in_progress' => ['completed'],
    ];

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(User $customer, ProviderProfile $provider, array $data): Booking
    {
        $service = ! empty($data['service_id']) ? Service::find($data['service_id']) : null;

        $booking = Booking::create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $provider->id,
            'service_id' => $service?->id,
            'status' => BookingStatus::Pending,
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'address' => $data['address'] ?? null,
            'description' => $data['description'],
            'agreed_price' => $service?->price ?? $provider->base_price,
            'payment_method' => 'cash',
            'payment_status' => 'unpaid',
        ]);

        $provider->loadMissing('user');
        $provider->user?->notify(new NewBookingRequestNotification($booking));

        return $booking;
    }

    public function accept(Booking $booking, ?float $agreedPrice = null): Booking
    {
        $this->guard($booking, BookingStatus::Accepted);
        $booking->update([
            'status' => BookingStatus::Accepted,
            'agreed_price' => $agreedPrice ?? $booking->agreed_price,
        ]);
        $this->notifyCustomer($booking, 'accepted');

        return $booking;
    }

    public function reject(Booking $booking, string $reason): Booking
    {
        $this->guard($booking, BookingStatus::Rejected);
        $booking->update(['status' => BookingStatus::Rejected, 'status_reason' => $reason]);
        $this->notifyCustomer($booking, 'rejected');

        return $booking;
    }

    public function start(Booking $booking): Booking
    {
        $this->guard($booking, BookingStatus::InProgress);
        $booking->update(['status' => BookingStatus::InProgress]);
        $this->notifyCustomer($booking, 'in_progress');

        return $booking;
    }

    public function complete(Booking $booking): Booking
    {
        $this->guard($booking, BookingStatus::Completed);
        $booking->update(['status' => BookingStatus::Completed, 'payment_status' => 'paid']);
        $this->notifyCustomer($booking, 'completed');

        return $booking;
    }

    public function cancel(Booking $booking, string $reason): Booking
    {
        $this->guard($booking, BookingStatus::Cancelled);
        $booking->update(['status' => BookingStatus::Cancelled, 'status_reason' => $reason]);

        return $booking;
    }

    private function guard(Booking $booking, BookingStatus $to): void
    {
        $allowed = self::TRANSITIONS[$booking->status->value] ?? [];

        if (! in_array($to->value, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => ['لا يمكن تنفيذ هذا الإجراء على الطلب في حالته الحالية.'],
            ]);
        }
    }

    private function notifyCustomer(Booking $booking, string $kind): void
    {
        $booking->loadMissing('customer');
        $booking->customer?->notify(new BookingStatusNotification($booking, $kind));
    }
}
