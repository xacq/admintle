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
        DB::table('support_tickets')->delete();
        DB::table('audit_logs')->delete();
        DB::table('reportes')->delete();
        DB::table('evaluaciones')->delete();
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
        ];

        DB::table('roles')->insert($roles);

        $roleIds = DB::table('roles')->pluck('id', 'name');

        DB::table('users')->insert([
            [
                'name' => 'Laura Tutor',
                'email' => 'tutor@example.com',
                'username' => 'tutor',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['tutor'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Bruno Becario',
                'email' => 'becario@example.com',
                'username' => 'becario',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['becario'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Ana Administradora',
                'email' => 'admin@example.com',
                'username' => 'admin',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['admin'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Diego Director',
                'email' => 'director@example.com',
                'username' => 'director',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['director'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Ana Guzmán',
                'email' => 'ana.guzman@example.com',
                'username' => 'ana.guzman',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Luis Mamani',
                'email' => 'luis.mamani@example.com',
                'username' => 'luis.mamani',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'José Flores',
                'email' => 'jose.flores@example.com',
                'username' => 'jose.flores',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['investigador'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Lic. Anny Mercado Algarañaz',
                'email' => 'anny.mercado@example.com',
                'username' => 'anny.mercado',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['tutor'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'Dr. Luis Rojas',
                'email' => 'luis.rojas@example.com',
                'username' => 'luis.rojas',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['tutor'],
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'name' => 'MSc. Juan García',
                'email' => 'juan.garcia@example.com',
                'username' => 'juan.garcia',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'role_id' => $roleIds['tutor'],
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
                'fecha_cierre' => null,
                'cerrada_por' => null,
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
                'fecha_cierre' => null,
                'cerrada_por' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'codigo' => 'PI-UATF-043',
                'becario_id' => $userIds['jose.flores'],
                'tutor_id' => $userIds['juan.garcia'],
                'fecha_inicio' => '2023-09-01',
                'fecha_fin' => '2024-06-30',
                'estado' => 'Archivada',
                'fecha_cierre' => Carbon::now()->subWeeks(2),
                'cerrada_por' => $userIds['director'] ?? null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'codigo' => 'PI-UATF-044',
                'becario_id' => $userIds['becario'],
                'tutor_id' => $userIds['tutor'],
                'fecha_inicio' => '2024-04-01',
                'fecha_fin' => '2024-12-15',
                'estado' => 'Activa',
                'fecha_cierre' => null,
                'cerrada_por' => null,
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

        $becaIds = DB::table('becas')->pluck('id', 'codigo');

        DB::table('reportes')->insert([
            [
                'beca_id' => $becaIds['PI-UATF-041'],
                'becario_id' => $userIds['ana.guzman'],
                'tutor_id' => $userIds['anny.mercado'],
                'titulo' => 'Avance Julio - Septiembre 2024',
                'descripcion' => 'Entrega correspondiente al tercer trimestre con énfasis en prototipos funcionales.',
                'fecha_envio' => Carbon::parse('2024-09-30 14:35:00'),
                'archivo' => 'reportes/PI-UATF-041-20240930.pdf',
                'archivo_nombre' => 'reporte-trimestre-3.pdf',
                'estado' => 'Aprobado',
                'observaciones' => 'Buen avance técnico y coherencia metodológica.',
                'calificacion' => 9,
                'fecha_revision' => Carbon::parse('2024-10-02 09:12:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'beca_id' => $becaIds['PI-UATF-041'],
                'becario_id' => $userIds['ana.guzman'],
                'tutor_id' => $userIds['anny.mercado'],
                'titulo' => 'Avance Octubre - Diciembre 2024',
                'descripcion' => 'Presentación de los resultados del cuarto trimestre con pruebas de rendimiento.',
                'fecha_envio' => Carbon::parse('2024-12-18 18:45:00'),
                'archivo' => 'reportes/PI-UATF-041-20241218.pdf',
                'archivo_nombre' => 'reporte-trimestre-4.pdf',
                'estado' => 'Aprobado',
                'observaciones' => 'Excelente consolidación del proyecto.',
                'calificacion' => 9,
                'fecha_revision' => Carbon::parse('2024-12-20 10:00:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'beca_id' => $becaIds['PI-UATF-041'],
                'becario_id' => $userIds['ana.guzman'],
                'tutor_id' => $userIds['anny.mercado'],
                'titulo' => 'Avance Enero - Marzo 2025',
                'descripcion' => 'Informe preliminar del último trimestre en revisión.',
                'fecha_envio' => Carbon::parse('2025-03-15 11:20:00'),
                'archivo' => 'reportes/PI-UATF-041-20250315.pdf',
                'archivo_nombre' => 'reporte-trimestre-1-2025.pdf',
                'estado' => 'Pendiente',
                'observaciones' => null,
                'calificacion' => null,
                'fecha_revision' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'beca_id' => $becaIds['PI-UATF-042'],
                'becario_id' => $userIds['luis.mamani'],
                'tutor_id' => $userIds['luis.rojas'],
                'titulo' => 'Avance Inicial',
                'descripcion' => 'Resumen de actividades del primer semestre con hallazgos preliminares.',
                'fecha_envio' => Carbon::parse('2024-08-31 16:05:00'),
                'archivo' => 'reportes/PI-UATF-042-20240831.pdf',
                'archivo_nombre' => 'avance-inicial.pdf',
                'estado' => 'Devuelto',
                'observaciones' => 'Ajustar la sección de metodología y anexar evidencias.',
                'calificacion' => 7,
                'fecha_revision' => Carbon::parse('2024-09-02 08:30:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('evaluaciones')->insert([
            [
                'beca_id' => $becaIds['PI-UATF-041'],
                'tutor_id' => $userIds['anny.mercado'],
                'calificacion_final' => 8.75,
                'observaciones_finales' => 'Excelente evolución del proyecto, con entregables completos y consistentes.',
                'estado_final' => 'Concluido',
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
        ]);

        DB::table('support_tickets')->insert([
            [
                'reporter_id' => $userIds['tutor'],
                'technician_id' => $userIds['admin'],
                'category' => 'Acceso',
                'status' => 'En revisión',
                'subject' => 'Problemas de inicio de sesión',
                'description' => 'No puedo acceder al sistema con mi contraseña habitual. He intentado restablecerla pero no recibo el correo.',
                'attachment_name' => null,
                'support_comment' => 'Estamos verificando el servidor de correo. Por favor, espere unos minutos.',
                'estimated_resolution_date' => Carbon::parse('2025-09-22'),
                'opened_at' => Carbon::parse('2025-09-21 09:15:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'reporter_id' => $userIds['ana.guzman'],
                'technician_id' => $userIds['admin'],
                'category' => 'Reporte',
                'status' => 'Resuelto',
                'subject' => 'Error al subir informe de avance',
                'description' => 'El sistema no me permite subir mi informe de avance. Me aparece un error de "archivo no válido".',
                'attachment_name' => 'captura_error.png',
                'support_comment' => 'El problema ha sido resuelto. El formato PDF ahora es compatible con el sistema. Intente nuevamente.',
                'estimated_resolution_date' => Carbon::parse('2025-09-22'),
                'opened_at' => Carbon::parse('2025-09-22 08:10:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'reporter_id' => $userIds['director'],
                'technician_id' => null,
                'category' => 'Sugerencia',
                'status' => 'Pendiente',
                'subject' => 'Notificaciones por correo',
                'description' => 'Sugiero agregar una función de notificación por correo cuando un reporte es aprobado.',
                'attachment_name' => null,
                'support_comment' => 'Gracias por su sugerencia. La evaluaremos para futuras actualizaciones.',
                'estimated_resolution_date' => null,
                'opened_at' => Carbon::parse('2025-09-23 10:45:00'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        DB::table('audit_logs')->insert([
            [
                'user_id' => $userIds['admin'],
                'usuario' => 'admin_dycit',
                'rol' => 'Administrador',
                'accion' => 'Creó nuevo usuario',
                'modulo' => 'Configuración',
                'resultado' => 'Éxito',
                'ip' => '192.168.1.2',
                'dispositivo' => 'Chrome / Windows 10',
                'descripcion' => 'Se creó un nuevo usuario con el nombre "María García López" y rol "Tutor".',
                'datos_previos' => json_encode(new \stdClass()),
                'datos_posteriores' => json_encode([
                    'id' => 5,
                    'nombre' => 'María García López',
                    'correo' => 'maria.garcia@uatf.edu.bo',
                    'rol' => 'Tutor',
                    'estado' => 'Activo',
                ]),
                'event_at' => Carbon::parse('2025-09-28 09:34:15'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $userIds['tutor'],
                'usuario' => 'juan.perez',
                'rol' => 'Tutor',
                'accion' => 'Revisó reporte de avance',
                'modulo' => 'Seguimiento',
                'resultado' => 'Éxito',
                'ip' => '192.168.1.45',
                'dispositivo' => 'Firefox / Windows 11',
                'descripcion' => 'El tutor revisó y aprobó el reporte de avance N°3 del becario "Ana Guzmán".',
                'datos_previos' => json_encode(['id_reporte' => 3, 'estado' => 'En revisión']),
                'datos_posteriores' => json_encode([
                    'id_reporte' => 3,
                    'estado' => 'Aprobado',
                    'calificacion' => 8.5,
                    'observaciones' => 'Buen progreso',
                ]),
                'event_at' => Carbon::parse('2025-09-28 09:36:22'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $userIds['ana.guzman'],
                'usuario' => 'ana.guzman',
                'rol' => 'Becaria',
                'accion' => 'Subió informe de avance',
                'modulo' => 'Seguimiento',
                'resultado' => 'Éxito',
                'ip' => '192.168.1.87',
                'dispositivo' => 'Safari / macOS',
                'descripcion' => 'La becaria subió el informe de avance correspondiente al mes de septiembre.',
                'datos_previos' => json_encode(new \stdClass()),
                'datos_posteriores' => json_encode([
                    'id_reporte' => 4,
                    'titulo' => 'Avance Septiembre',
                    'archivo' => 'informe_septiembre.pdf',
                    'estado' => 'En revisión',
                ]),
                'event_at' => Carbon::parse('2025-09-28 10:02:47'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $userIds['admin'],
                'usuario' => 'admin_dycit',
                'rol' => 'Administrador',
                'accion' => 'Eliminó registro antiguo',
                'modulo' => 'Archivo',
                'resultado' => 'Advertencia',
                'ip' => '192.168.1.2',
                'dispositivo' => 'Chrome / Windows 10',
                'descripcion' => 'Se eliminó un registro de proyecto del año 2020 por solicitud del departamento.',
                'datos_previos' => json_encode([
                    'id' => 15,
                    'codigo' => 'PI-UATF-005',
                    'titulo' => 'Estudio de suelos',
                    'estado' => 'Archivado',
                ]),
                'datos_posteriores' => json_encode(new \stdClass()),
                'event_at' => Carbon::parse('2025-09-28 10:05:13'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $userIds['director'],
                'usuario' => 'carlos.rojas',
                'rol' => 'Director',
                'accion' => 'Generó reporte institucional',
                'modulo' => 'Reportes',
                'resultado' => 'Éxito',
                'ip' => '192.168.1.33',
                'dispositivo' => 'Edge / Windows 10',
                'descripcion' => 'El director generó un reporte consolidado de todas las becas activas del semestre.',
                'datos_previos' => json_encode(new \stdClass()),
                'datos_posteriores' => json_encode([
                    'id_reporte' => 8,
                    'tipo' => 'Consolidado',
                    'periodo' => '2025-1',
                    'estado' => 'Generado',
                ]),
                'event_at' => Carbon::parse('2025-09-28 10:15:30'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => null,
                'usuario' => 'sistema',
                'rol' => 'Sistema',
                'accion' => 'Respaldo automático',
                'modulo' => 'Sistema',
                'resultado' => 'Éxito',
                'ip' => '127.0.0.1',
                'dispositivo' => 'Servidor',
                'descripcion' => 'Se realizó un respaldo automático de la base de datos.',
                'datos_previos' => json_encode(new \stdClass()),
                'datos_posteriores' => json_encode([
                    'backup' => 'backup_20250928_102218.sql',
                    'tamano' => '245.7 MB',
                    'ubicacion' => '/srv/backups/',
                ]),
                'event_at' => Carbon::parse('2025-09-28 10:22:18'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $userIds['becario'],
                'usuario' => 'luis.mamani',
                'rol' => 'Becario',
                'accion' => 'Inicio de sesión fallido',
                'modulo' => 'Autenticación',
                'resultado' => 'Error',
                'ip' => '192.168.1.92',
                'dispositivo' => 'Chrome / Android',
                'descripcion' => 'Intento de inicio de sesión fallido por contraseña incorrecta.',
                'datos_previos' => json_encode(new \stdClass()),
                'datos_posteriores' => json_encode([
                    'error' => 'Contraseña incorrecta',
                    'intento' => 3,
                    'usuario' => 'luis.mamani',
                ]),
                'event_at' => Carbon::parse('2025-09-28 10:30:45'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
