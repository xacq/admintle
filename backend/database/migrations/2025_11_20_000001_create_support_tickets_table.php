<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('category');
            $table->string('status')->default('Pendiente');
            $table->string('subject')->nullable();
            $table->text('description');
            $table->string('attachment_name')->nullable();
            $table->text('support_comment')->nullable();
            $table->date('estimated_resolution_date')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('category');
            $table->index('opened_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
