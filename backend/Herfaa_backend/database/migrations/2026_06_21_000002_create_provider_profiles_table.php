<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable()->index();
            $table->decimal('base_price', 10, 2)->nullable();
            $table->enum('price_unit', ['fixed', 'hourly', 'visit'])->default('visit');
            $table->enum('approval_status', ['pending', 'approved', 'rejected', 'suspended'])
                ->default('pending');
            $table->string('rejection_reason')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('rating_count')->default(0);
            $table->timestamps();

            // Search visibility + sorting rely on these.
            $table->index(['approval_status', 'rating_avg']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_profiles');
    }
};
