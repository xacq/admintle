<?php

namespace App\Http\Controllers;

use App\Models\Beca;
use App\Models\Evaluacion;
use App\Models\Reporte;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteInstitucionalController extends Controller
{
    public function summary(): JsonResponse
    {
        $becasPorEstado = Beca::query()
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        $totalBecas = $becasPorEstado->sum();

        $promedioCalificaciones = Evaluacion::query()
            ->whereNotNull('calificacion_final')
            ->avg('calificacion_final');

        $tutoresConMasBecas = User::query()
            ->select('users.id', 'users.name', DB::raw('COUNT(becas.id) as becas_asignadas'))
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->leftJoin('becas', 'becas.tutor_id', '=', 'users.id')
            ->where('roles.name', 'tutor')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('becas_asignadas')
            ->orderBy('users.name')
            ->limit(5)
            ->get()
            ->map(fn ($row, $index) => [
                'id' => $row->id,
                'nombre' => $row->name,
                'becasAsignadas' => (int) $row->becas_asignadas,
                'posicion' => $index + 1,
            ])
            ->values();

        $resumenReportes = Reporte::query()
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        $reportesRecientes = Reporte::query()
            ->with(['becario:id,name', 'tutor:id,name'])
            ->orderByDesc('fecha_envio')
            ->limit(5)
            ->get()
            ->map(fn (Reporte $reporte) => [
                'id' => $reporte->id,
                'titulo' => $reporte->titulo,
                'estado' => $reporte->estado,
                'becario' => $reporte->becario?->name,
                'tutor' => $reporte->tutor?->name,
                'fechaEnvio' => optional($reporte->fecha_envio)->toDateTimeString(),
                'fechaRevision' => optional($reporte->fecha_revision)->toDateTimeString(),
            ]);

        $evaluacionesPorEstado = Evaluacion::query()
            ->select('estado_final', DB::raw('COUNT(*) as total'))
            ->groupBy('estado_final')
            ->pluck('total', 'estado_final');

        return response()->json([
            'becas' => [
                'total' => $totalBecas,
                'activas' => (int) ($becasPorEstado['Activa'] ?? 0),
                'finalizadas' => (int) ($becasPorEstado['Finalizada'] ?? 0),
                'enEvaluacion' => (int) ($becasPorEstado['En evaluación'] ?? 0),
                'archivadas' => (int) ($becasPorEstado['Archivada'] ?? 0),
            ],
            'evaluaciones' => [
                'promedioGeneral' => $promedioCalificaciones ? round($promedioCalificaciones, 2) : null,
                'total' => Evaluacion::count(),
                'porEstado' => $this->normalizarClaves($evaluacionesPorEstado),
            ],
            'tutores' => [
                'top' => $tutoresConMasBecas,
            ],
            'reportes' => [
                'total' => Reporte::count(),
                'porEstado' => $this->normalizarClaves($resumenReportes),
                'recientes' => $reportesRecientes,
            ],
        ]);
    }

    /**
     * @param  \Illuminate\Support\Collection<string, int>  $collection
     * @return array<string, int>
     */
    private function normalizarClaves(Collection $collection): array
    {
        $resultado = [];

        foreach ($collection as $clave => $valor) {
            if (is_string($clave)) {
                $resultado[$clave] = (int) $valor;
                continue;
            }

            $resultado[(string) $clave] = (int) $valor;
        }

        return $resultado;
    }
}

