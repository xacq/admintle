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
        Schema::create('system_parameters', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year', 12);
            $table->date('management_start_date');
            $table->date('management_end_date');
            $table->date('report_deadline');
            $table->unsignedInteger('max_reports_per_scholar')->default(0);
            $table->enum('system_status', ['activo', 'cerrado'])->default('activo');
            $table->json('research_lines')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_parameters');
    }
};
