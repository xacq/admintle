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
        Schema::create('reportes_avance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('beca_id')->constrained()->cascadeOnDelete();
            $table->foreignId('becario_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tutor_id')->constrained('users')->cascadeOnDelete();
            $table->string('carrera');
            $table->string('universitario');
            $table->string('proyecto');
            $table->unsignedTinyInteger('trimestre');
            $table->unsignedTinyInteger('porcentaje_avance');
            $table->date('fecha_reporte');
            $table->json('actividades');
            $table->text('observaciones')->nullable();
            $table->string('estado')->default('Pendiente');
            $table->boolean('firmado_tutor')->default(false);
            $table->boolean('firmado_becario')->default(false);
            $table->boolean('firmado_director')->default(false);
            $table->timestamps();

            $table->index(['tutor_id', 'trimestre']);
            $table->index(['becario_id', 'trimestre']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes_avance');
    }
};
