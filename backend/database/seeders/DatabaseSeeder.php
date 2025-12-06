<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DocenteModuleSeeder::class,
            SystemParameterSeeder::class,
            RolesSeeder::class,
            UsersSeeder::class,
            CareerSeeder::class,
            UniversityMemberSeeder::class,
        ]);
    }
}
