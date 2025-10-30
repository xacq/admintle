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
        Schema::table('becas', function (Blueprint $table) {
            $table->timestamp('fecha_cierre')->nullable()->after('fecha_fin');
            $table->foreignId('cerrada_por')->nullable()->after('fecha_cierre')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('becas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cerrada_por');
            $table->dropColumn('fecha_cierre');
        });
    }
};
