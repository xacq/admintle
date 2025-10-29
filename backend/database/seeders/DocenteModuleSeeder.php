<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DocenteModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('becas')->delete();
        DB::table('users')->delete();
        DB::table('roles')->delete();

        $timestamp = Carbon::now();

        $roles = [
            [
                'name' => 'tutor',
                'display_name' => 'Tutor',
                'dashboard_route' => '/dashboard/tutor',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'becario',
                'display_name' => 'Becario',
                'dashboard_route' => '/dashboard/becario',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrador',
                'dashboard_route' => '/dashboard/admin',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'director',
                'display_name' => 'Director',
                'dashboard_route' => '/dashboard/director',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'investigador',
                'display_name' => 'Investigador',
                'dashboard_route' => '/dashboard/becario',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'evaluador',
                'display_name' => 'Evaluador',
                'dashboard_route' => '/dashboard/tutor',
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
        ];

        DB::table('roles')->insert($roles);

        $roleIds = DB::table('roles')->pluck('id', 'name');

        DB::table('users')->insert([
            [
                'name' => 'Laura Tutor',
                'email' => 'tutor@example.com',
                'username' => 'tutor',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['tutor'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Bruno Becario',
                'email' => 'becario@example.com',
                'username' => 'becario',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['becario'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Ana Administradora',
                'email' => 'admin@example.com',
                'username' => 'admin',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['admin'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Diego Director',
                'email' => 'director@example.com',
                'username' => 'director',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['director'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Ana Guzmán',
                'email' => 'ana.guzman@example.com',
                'username' => 'ana.guzman',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Luis Mamani',
                'email' => 'luis.mamani@example.com',
                'username' => 'luis.mamani',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'José Flores',
                'email' => 'jose.flores@example.com',
                'username' => 'jose.flores',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Lic. Anny Mercado Algarañaz',
                'email' => 'anny.mercado@example.com',
                'username' => 'anny.mercado',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['evaluador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Dr. Luis Rojas',
                'email' => 'luis.rojas@example.com',
                'username' => 'luis.rojas',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['evaluador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'MSc. Juan García',
                'email' => 'juan.garcia@example.com',
                'username' => 'juan.garcia',
                'password' => Hash::make('password123'),
                'role_id' => $roleIds['evaluador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
        ]);

        $userIds = DB::table('users')->pluck('id', 'username');

        DB::table('becas')->insert([
            [
                'codigo' => 'PI-UATF-041',
                'becario_id' => $userIds['ana.guzman'],
                'tutor_id' => $userIds['anny.mercado'],
                'fecha_inicio' => '2024-02-15',
                'fecha_fin' => '2024-11-30',
                'estado' => 'Activa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'codigo' => 'PI-UATF-042',
                'becario_id' => $userIds['luis.mamani'],
                'tutor_id' => $userIds['luis.rojas'],
                'fecha_inicio' => '2024-03-10',
                'fecha_fin' => '2024-12-20',
                'estado' => 'En evaluación',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'codigo' => 'PI-UATF-043',
                'becario_id' => $userIds['jose.flores'],
                'tutor_id' => $userIds['juan.garcia'],
                'fecha_inicio' => '2023-09-01',
                'fecha_fin' => '2024-06-30',
                'estado' => 'Finalizada',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('designaciones')->insert([
            [
                'fecha' => '2024-01-03',
                'empleado' => 'Ana Rodríguez',
                'puesto' => 'Docente Titular',
                'departamento' => 'Matemáticas',
                'estado' => 'Activa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'fecha' => '2023-11-18',
                'empleado' => 'Carlos López',
                'puesto' => 'Docente Auxiliar',
                'departamento' => 'Informática',
                'estado' => 'Concluida',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'fecha' => '2023-07-07',
                'empleado' => 'Lucía Pérez',
                'puesto' => 'Investigador',
                'departamento' => 'Laboratorio',
                'estado' => 'Activa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('historial_estudiantes')->insert([
            [
                'full_name' => 'FULANO MENCHACA',
                'repetidos' => 1,
                'nota' => 52,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'MARIA SOSA CABRERA',
                'repetidos' => 1,
                'nota' => 45,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'full_name' => 'PABLO MARQUEZ POLI',
                'repetidos' => 0,
                'nota' => 80,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('estudiantes')->insert([
            [
                'ru' => '123456',
                'name' => 'FULANO MENCHACA',
                'ci' => '12345678',
                'nota' => 60,
                'celular' => '60148532',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'ru' => '789012',
                'name' => 'MARIA SOSA CABRERA',
                'ci' => '78901234',
                'nota' => 55,
                'celular' => '78965412',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'ru' => '456789',
                'name' => 'PABLO MARQUEZ POLI',
                'ci' => '45678901',
                'nota' => 80,
                'celular' => '70512345',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('materias')->insert([
            [
                'name' => 'SEMINARIO DE SISTEMAS',
                'agu' => 36,
                'nickname' => 'SIS719',
                'details' => json_encode(['checked' => false]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'BASES DE DATOS II',
                'agu' => 48,
                'nickname' => 'SIS650',
                'details' => json_encode(['checked' => true]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'REDES AVANZADAS',
                'agu' => 40,
                'nickname' => 'TEL520',
                'details' => json_encode(['checked' => false]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        $today = Carbon::today();

        DB::table('notificaciones')->insert([
            [
                'numero' => 1,
                'titulo' => 'Entrega de notas',
                'descripcion' => 'Recordatorio de entrega de calificaciones finales.',
                'hasta' => $today->toDateString(),
                'categoria' => 'actual',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'numero' => 2,
                'titulo' => 'Reunión docente',
                'descripcion' => 'Convocatoria a reunión de coordinación semanal.',
                'hasta' => $today->copy()->addDay()->toDateString(),
                'categoria' => 'actual',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'numero' => 3,
                'titulo' => 'Notificación archivada',
                'descripcion' => 'Ejemplo de notificación anterior.',
                'hasta' => $today->copy()->subDays(3)->toDateString(),
                'categoria' => 'anterior',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'numero' => 4,
                'titulo' => 'Registro histórico',
                'descripcion' => 'Esta notificación forma parte del registro general.',
                'hasta' => $today->copy()->subDays(6)->toDateString(),
                'categoria' => 'registro',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
