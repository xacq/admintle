<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('careers', function (Blueprint $table) {
            $table->id();
            $table->string('name');    // Ejemplo: Ingeniería de Sistemas
            $table->string('faculty'); // Ejemplo: Facultad Ingeniería y Tecnología
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('careers');
    }
};