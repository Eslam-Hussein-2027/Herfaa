<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/** Sent to the customer when their booking is accepted/rejected/advanced. */
class BookingStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking, public string $kind) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $map = [
            'accepted' => ['تم تأكيد حجزك على حِرفة', 'تم تأكيد حجزك من قبل الفنّي، وسيتواصل معك قريباً لإتمام العمل.'],
            'rejected' => ['تم رفض طلب حجزك', 'نعتذر، لم يتمكن الحِرفي من قبول طلبك هذه المرة.'],
            'in_progress' => ['بدأ تنفيذ طلبك', 'بدأ الحِرفي العمل على طلبك.'],
            'completed' => ['تم إنجاز طلبك', 'تم إنجاز العمل بنجاح. لا تنسَ تقييم الحِرفي!'],
        ];

        [$subject, $line] = $map[$this->kind] ?? ['تحديث حالة طلبك', 'تم تحديث حالة طلبك.'];

        $mail = (new MailMessage)
            ->subject($subject)
            ->greeting('مرحباً '.$notifiable->name)
            ->line($line);

        if ($this->kind === 'rejected' && $this->booking->status_reason) {
            $mail->line('السبب: '.$this->booking->status_reason);
        }

        return $mail->action('عرض طلباتي', config('app.frontend_url').'/bookings');
    }
}
