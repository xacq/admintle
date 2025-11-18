<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesSeeder extends Seeder
{
    public function run()
    {
        DB::table('roles')->insert([
            [
                'id' => 68,
                'slug' => 'tutor',
                'nombre' => 'Tutor',
                'dashboard' => '/dashboard/tutor',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 69,
                'slug' => 'becario',
                'nombre' => 'Becario',
                'dashboard' => '/dashboard/becario',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 70,
                'slug' => 'admin',
                'nombre' => 'Administrador',
                'dashboard' => '/dashboard/admin',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 71,
                'slug' => 'director',
                'nombre' => 'Director',
                'dashboard' => '/dashboard/director',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 72,
                'slug' => 'investigador',
                'nombre' => 'Investigador',
                'dashboard' => '/dashboard/becario',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
        ]);
    }
}
