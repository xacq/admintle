<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('roles')
            ->where('name', 'tutor')
            ->update([
                'display_name' => 'Tutor/Evaluador',
                'updated_at' => Carbon::now(),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')
            ->where('name', 'tutor')
            ->update([
                'display_name' => 'Tutor',
                'updated_at' => Carbon::now(),
            ]);
    }
};
