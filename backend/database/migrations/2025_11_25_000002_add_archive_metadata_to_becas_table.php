<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('becas', function (Blueprint $table) {
            $table->boolean('archivada')->default(false)->after('estado');
            $table->timestamp('fecha_archivo')->nullable()->after('archivada');
        });

        DB::table('becas')
            ->where('estado', 'Archivada')
            ->update([
                'archivada' => true,
                'fecha_archivo' => DB::raw('COALESCE(fecha_cierre, CURRENT_TIMESTAMP)')
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('becas', function (Blueprint $table) {
            $table->dropColumn(['archivada', 'fecha_archivo']);
        });
    }
};
