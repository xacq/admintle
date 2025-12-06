<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Vinculación con la carrera (NUEVO)
            $table->foreignId('career_id')->nullable()->constrained()->onDelete('set null');
            
            // Vinculación con la persona importada (NUEVO)
            $table->foreignId('university_member_id')
                  ->nullable()
                  ->constrained('university_members')
                  ->onDelete('set null');
            
            // NO agregamos 'role' (string) porque ya tienes 'role_id'.
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['career_id']);
            $table->dropColumn('career_id');
            $table->dropForeign(['university_member_id']);
            $table->dropColumn('university_member_id');
        });
    }
};