<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Scholarship;
use App\Models\User;
use App\Models\Career;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ScholarshipSeeder extends Seeder
{
    public function run()
    {
        // 1. Obtener Estudiantes y Tutores basados en los IDs de rol del CSV
        // role_id 2 y 5 = Estudiantes (según tu archivo)
        // role_id 1 = Tutores
        $students = User::whereIn('role_id', [2, 5])->get();
        $tutors = User::where('role_id', 1)->get();

        // Validar que existan datos
        if ($students->isEmpty() || $tutors->isEmpty()) {
            $this->command->error('No se encontraron usuarios con roles de estudiante (2,5) o tutor (1). Ejecuta primero el UserSeeder.');
            return;
        }

        // Obtener carreras para asignar aleatoriamente (ya que en el CSV vienen vacías)
        $careers = Career::all();
        if ($careers->isEmpty()) {
            $this->command->error('No hay carreras registradas. Ejecuta el CareerSeeder primero.');
            return;
        }

        $this->command->info("Generando becas para {$students->count()} estudiantes usando {$tutors->count()} tutores...");

        foreach ($students as $index => $student) {
            // Seleccionar un tutor aleatorio y una carrera aleatoria
            $tutor = $tutors->random();
            $career = $careers->random();

            // Si el estudiante no tiene carrera asignada en users, se la asignamos ahora
            if (!$student->career_id) {
                $student->career_id = $career->id;
                $student->save();
            }

            // Generar datos ficticios para la beca
            // Usamos un CI ficticio basado en su ID para el código de beca
            $fakeCI = 6000000 + $student->id; 
            
            Scholarship::create([
                'scholarship_code' => (string) $fakeCI, // Requerimiento: Código es el CI
                'project_title'    => 'Proyecto de Investigación: ' . $this->getFakeProjectName($index),
                'student_user_id'  => $student->id,
                'tutor_user_id'    => $tutor->id,
                'career_id'        => $student->career_id, // Usamos la carrera del estudiante
                'start_date'       => Carbon::now()->subMonths(rand(1, 5)), // Empezó hace unos meses
                'end_date'         => Carbon::now()->addMonths(rand(3, 6)), // Termina en el futuro
                'year'             => 2025,
                'status'           => 'active',
                'final_evaluation' => null, // Aún activa
            ]);
        }
        
        $this->command->info('Becas creadas exitosamente.');
    }

    // Helper para generar nombres de proyectos más realistas
    private function getFakeProjectName($index)
    {
        $projects = [
            'Automatización de Procesos Administrativos',
            'Análisis de Datos con IA',
            'Desarrollo de App Móvil para Becarios',
            'Optimización de Redes Neuronales',
            'Sistema de Gestión Documental',
            'Impacto de la Tecnología en la Educación'
        ];

        return $projects[$index % count($projects)];
    }
}