<?php

namespace Database\Seeders;

use App\Models\SystemParameter;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SystemParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = (int) now()->format('Y');
        $start = Carbon::create($currentYear, 1, 1);
        $end = Carbon::create($currentYear, 12, 31);
        $deadline = Carbon::create($currentYear, 12, 15);

        SystemParameter::query()->updateOrCreate(
            ['id' => 1],
            [
                'academic_year' => (string) $currentYear,
                'management_start_date' => $start->toDateString(),
                'management_end_date' => $end->toDateString(),
                'report_deadline' => $deadline->toDateString(),
                'max_reports_per_scholar' => 6,
                'system_status' => 'activo',
                'research_lines' => [
                    'Ciencia de materiales y metalurgia',
                    'Tecnologías de información aplicadas a la minería',
                    'Energías alternativas y eficiencia energética',
                ],
            ]
        );
    }
}
