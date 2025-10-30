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
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('beca_id')->constrained()->cascadeOnDelete();
            $table->foreignId('becario_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tutor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->timestamp('fecha_envio');
            $table->string('archivo');
            $table->string('archivo_nombre');
            $table->string('estado')->default('Pendiente');
            $table->text('observaciones')->nullable();
            $table->unsignedTinyInteger('calificacion')->nullable();
            $table->timestamp('fecha_revision')->nullable();
            $table->timestamps();

            $table->index(['tutor_id', 'estado']);
            $table->index(['becario_id', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
