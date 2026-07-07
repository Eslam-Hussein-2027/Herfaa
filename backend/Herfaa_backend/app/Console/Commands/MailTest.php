<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

/**
 * Quick SMTP smoke-test: sends a synchronous test email so you can verify the
 * mail configuration works without going through the full booking flow.
 *
 * Usage:  php artisan herfaa:mail-test you@example.com
 */
class MailTest extends Command
{
    protected $signature = 'herfaa:mail-test {to : Recipient email address}';

    protected $description = 'Send a test email through the configured SMTP mailer to verify it works';

    public function handle(): int
    {
        $to = $this->argument('to');
        $mailer = config('mail.default');
        $host = config('mail.mailers.smtp.host');

        $this->info("Sending a test email to {$to} via [{$mailer}] ({$host})...");

        try {
            Mail::raw(
                "هذه رسالة تجريبية من منصّة حِرفة للتأكد من عمل خدمة البريد (SMTP).\n\n".
                "This is a test message from Herfaa to confirm the SMTP email service is working.",
                function ($message) use ($to) {
                    $message->to($to)->subject('اختبار البريد — حِرفة / Herfaa SMTP test');
                }
            );
        } catch (\Throwable $e) {
            $this->error('✗ Failed to send: '.$e->getMessage());
            $this->line('Check MAIL_USERNAME / MAIL_PASSWORD (App Password) and MAIL_HOST/PORT in your .env.');

            return self::FAILURE;
        }

        $this->info('✓ Sent successfully. Check the inbox (it may land in Spam on first send).');

        return self::SUCCESS;
    }
}
