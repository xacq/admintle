<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            
            // Relación con la Beca
            $table->foreignId('scholarship_id')->constrained()->onDelete('cascade');
            
            // Número de informe (1, 2 o 3)
            $table->integer('report_number'); 
            
            // --- GESTIÓN DEL TUTOR ---
            // El tutor define este rango de fechas para presentar [Video 2]
            $table->date('deadline_start')->nullable();
            $table->date('deadline_end')->nullable();
            
            // --- GESTIÓN DEL ESTUDIANTE ---
            // Datos que llena el becario al subir su tarea [Video 2]
            $table->date('production_date')->nullable();
            $table->text('problem_description')->nullable();
            $table->string('file_path')->nullable(); // Ruta del archivo PDF/Doc
            
            // --- ESTADO Y EVALUACIÓN ---
            // pending: Nadie ha subido nada
            // submitted: Estudiante subió, espera revisión
            // changes_requested: Tutor pide correcciones (Video 2: "que aumente alcance")
            // approved: Aprobado (Habilita el siguiente informe)
            $table->enum('status', ['pending', 'submitted', 'changes_requested', 'approved'])
                  ->default('pending');
            
            $table->text('tutor_feedback')->nullable(); // Observaciones del tutor
            
            $table->timestamps();
            
            // Asegurar que no haya dos informes #1 para la misma beca
            $table->unique(['scholarship_id', 'report_number']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reports');
    }
};