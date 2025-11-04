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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('usuario');
            $table->string('rol')->nullable();
            $table->string('accion');
            $table->string('modulo');
            $table->string('resultado');
            $table->string('ip')->nullable();
            $table->string('dispositivo')->nullable();
            $table->text('descripcion')->nullable();
            $table->json('datos_previos')->nullable();
            $table->json('datos_posteriores')->nullable();
            $table->timestamp('event_at');
            $table->timestamps();

            $table->index('event_at');
            $table->index('usuario');
            $table->index('modulo');
            $table->index('accion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
