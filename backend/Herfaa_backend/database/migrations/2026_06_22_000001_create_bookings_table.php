<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('provider_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'])
                ->default('pending');
            $table->dateTime('scheduled_at')->nullable();
            $table->string('address')->nullable();
            $table->text('description');
            $table->decimal('agreed_price', 10, 2)->nullable();
            $table->string('status_reason')->nullable(); // reject/cancel reason
            $table->string('payment_method')->default('cash'); // cash only
            $table->string('payment_status')->default('unpaid'); // unpaid | paid
            $table->timestamps();

            $table->index(['provider_profile_id', 'status']);
            $table->index(['customer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
