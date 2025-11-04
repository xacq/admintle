<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSystemParameterRequest;
use App\Models\SystemParameter;
use App\Services\MaintenanceTaskService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SystemParameterController extends Controller
{
    public function __construct(private readonly MaintenanceTaskService $maintenanceTaskService)
    {
    }

    public function show(): JsonResponse
    {
        $parameter = $this->ensureParameter();

        return response()->json(['data' => $this->transform($parameter)]);
    }

    public function update(UpdateSystemParameterRequest $request): JsonResponse
    {
        $parameter = $this->ensureParameter();
        $data = $request->validated();

        if (array_key_exists('research_lines', $data)) {
            $data['research_lines'] = collect($data['research_lines'])
                ->filter(fn ($line) => filled($line))
                ->values()
                ->all();
        }

        $parameter->fill($data);
        $parameter->save();

        return response()->json([
            'message' => 'Parámetros del sistema actualizados correctamente.',
            'data' => $this->transform($parameter),
        ]);
    }

    public function maintenance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', Rule::in(MaintenanceTaskService::SUPPORTED_ACTIONS)],
        ]);

        $message = $this->maintenanceTaskService->handle($validated['action']);

        return response()->json([
            'message' => $message,
            'meta' => [
                'action' => $validated['action'],
                'completed_at' => now()->toIso8601String(),
            ],
        ]);
    }

    public function tasks(): JsonResponse
    {
        $tasks = [
            [
                'action' => MaintenanceTaskService::ACTION_BACKUP,
                'title' => 'Generar respaldo completo',
                'description' => 'Realiza una copia de seguridad de la base de datos y archivos adjuntos.',
                'icon' => '💾',
            ],
            [
                'action' => MaintenanceTaskService::ACTION_CLEAN_TEMP,
                'title' => 'Depurar archivos temporales',
                'description' => 'Elimina archivos temporales y cachés para mejorar el rendimiento.',
                'icon' => '🧹',
            ],
            [
                'action' => MaintenanceTaskService::ACTION_RECALCULATE_METRICS,
                'title' => 'Recalcular métricas globales',
                'description' => 'Actualiza estadísticas generales y consolida indicadores institucionales.',
                'icon' => '📈',
            ],
        ];

        return response()->json(['data' => $tasks]);
    }

    private function ensureParameter(): SystemParameter
    {
        $parameter = SystemParameter::query()->first();

        if (! $parameter) {
            $parameter = SystemParameter::create($this->defaultValues());
        }

        return $parameter;
    }

    private function defaultValues(): array
    {
        $today = Carbon::today();
        $start = $today->copy()->startOfYear();
        $end = $today->copy()->endOfYear();

        return [
            'academic_year' => $today->format('Y'),
            'management_start_date' => $start->toDateString(),
            'management_end_date' => $end->toDateString(),
            'report_deadline' => $end->toDateString(),
            'max_reports_per_scholar' => 3,
            'system_status' => 'activo',
            'research_lines' => [],
        ];
    }

    private function transform(SystemParameter $parameter): array
    {
        return [
            'id' => $parameter->id,
            'academicYear' => $parameter->academic_year,
            'managementStartDate' => optional($parameter->management_start_date)->toDateString(),
            'managementEndDate' => optional($parameter->management_end_date)->toDateString(),
            'reportDeadline' => optional($parameter->report_deadline)->toDateString(),
            'maxReportsPerScholar' => $parameter->max_reports_per_scholar,
            'systemStatus' => $parameter->system_status,
            'researchLines' => $parameter->research_lines ?? [],
        ];
    }
}
