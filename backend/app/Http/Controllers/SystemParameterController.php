<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSystemParameterRequest;
use App\Models\SystemParameter;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class SystemParameterController extends Controller
{
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
