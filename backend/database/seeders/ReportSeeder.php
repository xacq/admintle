<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\Scholarship;
use Carbon\Carbon;

class ReportSeeder extends Seeder
{
    public function run()
    {
        // Obtener todas las becas existentes
        $scholarships = Scholarship::all();

        if ($scholarships->isEmpty()) {
            $this->command->warn('No hay becas para generar reportes. Ejecuta ScholarshipSeeder primero.');
            return;
        }

        foreach ($scholarships as $scholarship) {
            // El Video 2 dice que son 3 trimestres. Generamos los 3 slots de reportes.
            
            // INFORME 1: Supongamos que ya fue configurado por el tutor
            Report::create([
                'scholarship_id' => $scholarship->id,
                'report_number' => 1,
                'deadline_start' => Carbon::now()->subMonths(2),
                'deadline_end' => Carbon::now()->subMonth(),
                'status' => 'approved', // Ya aprobado para probar lógica del 2do
                'production_date' => Carbon::now()->subMonths(1)->subDays(5),
                'problem_description' => 'Avance inicial de la investigación bibliográfica.',
                'tutor_feedback' => 'Buen inicio, continuar con el marco teórico.',
                'file_path' => 'reports/dummy_report_1.pdf'
            ]);

            // INFORME 2: El actual (Pendiente de subir por el estudiante)
            Report::create([
                'scholarship_id' => $scholarship->id,
                'report_number' => 2,
                'deadline_start' => Carbon::now()->subDays(5),
                'deadline_end' => Carbon::now()->addMonth(),
                'status' => 'pending', // El sistema debería mostrar este activo
            ]);

            // INFORME 3: Futuro (Bloqueado/Aún no configurado)
            Report::create([
                'scholarship_id' => $scholarship->id,
                'report_number' => 3,
                'status' => 'pending',
                // Sin fechas aún, el tutor debe ponerlas cuando llegue el momento
            ]);
        }
        
        $this->command->info('Reportes trimestrales generados para todas las becas.');
    }
}