<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('university_members', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('ci')->unique(); // Carnet de identidad único
            $table->enum('type', ['student', 'teacher'])->default('student'); 
            $table->foreignId('career_id')->constrained('careers')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('university_members');
    }
};