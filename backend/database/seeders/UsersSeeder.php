<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'id' => 137,
                'name' => 'Laura Tutor',
                'email' => 'tutor@example.com',
                'username' => 'tutor',
                'email_verified_at' => null,
                'password' => '$2y$12$BZ3r5lmMIe8OyOOD...sW9xIJvVEhRIuaIsbW',
                'role_id' => 68,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 138,
                'name' => 'Bruno Becario',
                'email' => 'becario@example.com',
                'username' => 'becario',
                'email_verified_at' => null,
                'password' => '$2y$12$DL1a5SwZ3E...Mx6xPfAB9kxqgXpSsu',
                'role_id' => 69,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 139,
                'name' => 'Ana Administradora',
                'email' => 'admin@example.com',
                'username' => 'admin',
                'email_verified_at' => null,
                'password' => '$2y$12$./H1pvJdf...4l1rggx6jnDYK21e8u',
                'role_id' => 70,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 140,
                'name' => 'Diego Director',
                'email' => 'director@example.com',
                'username' => 'director',
                'email_verified_at' => null,
                'password' => '$2y$12$QeS.ZDW....0FpUu0YeERy2AKvDy',
                'role_id' => 71,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 141,
                'name' => 'Ana Guzmán',
                'email' => 'ana.guzman@example.com',
                'username' => 'ana.guzman',
                'email_verified_at' => null,
                'password' => '$2y$12$omneI5r...I9B/WcKaitvV6gQe2m',
                'role_id' => 72,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 142,
                'name' => 'Luis Mamani',
                'email' => 'luis.mamani@example.com',
                'username' => 'luis.mamani',
                'email_verified_at' => null,
                'password' => '$2y$12$akFD...2ornEu.hYdLERqU0oW',
                'role_id' => 72,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 143,
                'name' => 'José Flores',
                'email' => 'jose.flores@example.com',
                'username' => 'jose.flores',
                'email_verified_at' => null,
                'password' => '$2y$12$WpWl...DDydhUS50cpfv41Jwu',
                'role_id' => 72,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 144,
                'name' => 'Lic. Anny Mercado Algarañaz',
                'email' => 'anny.mercado@example.com',
                'username' => 'anny.mercado',
                'email_verified_at' => null,
                'password' => 'D119xpTSrH/dkPuhQq', // viene así en tu archivo
                'role_id' => 68,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 145,
                'name' => 'Dr. Luis Rojas',
                'email' => 'luis.rojas@example.com',
                'username' => 'luis.rojas',
                'email_verified_at' => null,
                'password' => '$2y$12$DxZ...HMxpUzjdA2EYjwoT86',
                'role_id' => 68,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 146,
                'name' => 'MSc. Juan García',
                'email' => 'juan.garcia@example.com',
                'username' => 'juan.garcia',
                'email_verified_at' => null,
                'password' => '$2y$12...jRCGrmu7jWZRITkXj.',
                'role_id' => 68,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:16:07',
                'updated_at' => '2025-11-13 03:16:07',
                'is_active' => 't'
            ],
            [
                'id' => 147,
                'name' => 'tuto',
                'email' => 'tuto@email.com',
                'username' => 'tuto',
                'email_verified_at' => null,
                'password' => '$2y$12$MwfYxJtL93D3PW3MIZ8GE.nHFi8...6aYpfrkCfFKuBPrxgC',
                'role_id' => 68,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:19:11',
                'updated_at' => '2025-11-13 03:19:11',
                'is_active' => 't'
            ],
            [
                'id' => 148,
                'name' => 'beca',
                'email' => 'beca@correo.com',
                'username' => 'beca',
                'email_verified_at' => null,
                'password' => '$2y$12$G7pHCypJJ/8oar7fGrWIeOT1Ta...P3YFbDROOrIt2uRAO6',
                'role_id' => 69,
                'remember_token' => null,
                'created_at' => '2025-11-13 03:20:04',
                'updated_at' => '2025-11-13 03:20:04',
                'is_active' => 't'
            ],
        ]);
    }
}
