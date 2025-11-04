<?php

namespace App\Services;

use App\Models\Beca;
use App\Models\Evaluacion;
use App\Models\Reporte;
use App\Models\SystemParameter;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class MaintenanceTaskService
{
    public const ACTION_BACKUP = 'backup';
    public const ACTION_CLEAN_TEMP = 'clean-temp';
    public const ACTION_RECALCULATE_METRICS = 'recalculate-metrics';

    /**
     * @var list<string>
     */
    public const SUPPORTED_ACTIONS = [
        self::ACTION_BACKUP,
        self::ACTION_CLEAN_TEMP,
        self::ACTION_RECALCULATE_METRICS,
    ];

    public function handle(string $action): string
    {
        return match ($action) {
            self::ACTION_BACKUP => $this->generateBackup(),
            self::ACTION_CLEAN_TEMP => $this->cleanTemporaryFiles(),
            self::ACTION_RECALCULATE_METRICS => $this->recalculateMetrics(),
            default => throw new \InvalidArgumentException("Acción de mantenimiento no soportada: {$action}"),
        };
    }

    private function generateBackup(): string
    {
        $timestamp = Carbon::now();
        $parameter = SystemParameter::query()->first();

        $payload = [
            'generated_at' => $timestamp->toIso8601String(),
            'system_parameters' => $parameter ? [
                'academic_year' => $parameter->academic_year,
                'management_start_date' => optional($parameter->management_start_date)->toDateString(),
                'management_end_date' => optional($parameter->management_end_date)->toDateString(),
                'report_deadline' => optional($parameter->report_deadline)->toDateString(),
                'max_reports_per_scholar' => $parameter->max_reports_per_scholar,
                'system_status' => $parameter->system_status,
                'research_lines' => $parameter->research_lines ?? [],
            ] : null,
            'totals' => [
                'becas' => Beca::query()->count(),
                'reportes' => Reporte::query()->count(),
                'evaluaciones' => Evaluacion::query()->count(),
                'usuarios' => User::query()->count(),
            ],
        ];

        $disk = Storage::disk('local');
        $directory = 'backups';
        $disk->makeDirectory($directory);

        $filename = sprintf('%s/system-backup-%s.json', $directory, $timestamp->format('Ymd_His'));
        $disk->put($filename, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return "Respaldo generado correctamente en storage/app/{$filename}.";
    }

    private function cleanTemporaryFiles(): string
    {
        $directories = [
            storage_path('app/temp'),
            storage_path('framework/cache'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
        ];

        $cleaned = 0;

        foreach ($directories as $directory) {
            if (is_dir($directory)) {
                File::deleteDirectory($directory);
                File::makeDirectory($directory, 0755, true);
                $cleaned++;
            }
        }

        $tempDirectory = storage_path('app/temp');
        if (! is_dir($tempDirectory)) {
            File::makeDirectory($tempDirectory, 0755, true);
        }

        return $cleaned > 0
            ? 'Archivos temporales depurados correctamente.'
            : 'No se encontraron directorios temporales para depurar.';
    }

    private function recalculateMetrics(): string
    {
        $timestamp = Carbon::now();

        $reportesPorEstado = Reporte::query()
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado')
            ->toArray();

        $metrics = [
            'generated_at' => $timestamp->toIso8601String(),
            'totals' => [
                'becas' => Beca::query()->count(),
                'reportes' => Reporte::query()->count(),
                'reportes_por_estado' => $reportesPorEstado,
                'evaluaciones' => Evaluacion::query()->count(),
                'usuarios_activos' => User::query()->where('is_active', true)->count(),
            ],
        ];

        $disk = Storage::disk('local');
        $directory = 'maintenance';
        $disk->makeDirectory($directory);
        $disk->put(
            $directory . '/metrics-summary.json',
            json_encode($metrics, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        return 'Métricas globales recalculadas correctamente.';
    }
}
