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
                'name' => 'tutor',
                'display_name' => 'Tutor',
                'dashboard_route' => '/dashboard/tutor',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 69,
                'name' => 'becario',
                'display_name' => 'Becario',
                'dashboard_route' => '/dashboard/becario',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 70,
                'name' => 'admin',
                'display_name' => 'Administrador',
                'dashboard_route' => '/dashboard/admin',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 71,
                'name' => 'director',
                'display_name' => 'Director',
                'dashboard_route' => '/dashboard/director',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
            [
                'id' => 72,
                'name' => 'investigador',
                'display_name' => 'Investigador',
                'dashboard_route' => '/dashboard/becario',
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
            ],
        ]);
    }
}
