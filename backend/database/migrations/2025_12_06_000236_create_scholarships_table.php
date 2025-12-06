<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            
            // Requerimiento Video 1: El código es el CI del estudiante
            $table->string('scholarship_code'); 
            
            $table->string('project_title');
            
            // Relaciones con usuarios (Estudiante y Tutor)
            $table->foreignId('student_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_user_id')->constrained('users')->onDelete('cascade');
            
            // Requerimiento Video 1: Vincular carrera explícitamente
            $table->foreignId('career_id')->constrained()->onDelete('cascade');
            
            // Requerimiento Video 2: Fechas generales
            $table->date('start_date');
            $table->date('end_date');
            
            // Requerimiento Video 3: Gestión/Año para el "Archivado"
            $table->integer('year'); 
            
            // Estados y Evaluación Final (Video 2)
            $table->enum('status', ['active', 'finished', 'cancelled'])->default('active');
            $table->text('final_evaluation')->nullable(); // Se llena al final del ciclo
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scholarships');
    }
};