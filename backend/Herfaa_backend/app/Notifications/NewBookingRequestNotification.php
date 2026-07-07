<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/** Sent to the provider when a customer creates a booking request. */
class NewBookingRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $b = $this->booking;

        return (new MailMessage)
            ->subject('طلب حجز جديد على حِرفة')
            ->greeting('لديك طلب حجز جديد')
            ->line('العميل: '.$b->customer->name)
            ->when($b->service, fn ($m) => $m->line('الخدمة: '.$b->service->title))
            ->line('التفاصيل: '.$b->description)
            ->action('عرض الطلب', config('app.frontend_url').'/provider/bookings')
            ->line('يمكنك قبول الطلب أو رفضه من لوحة التحكم.');
    }
}
