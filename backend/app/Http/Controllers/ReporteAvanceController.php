<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReporteAvanceResource;
use App\Models\Beca;
use App\Models\ReporteAvance;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ReporteAvanceController extends Controller
{
    public function index(Request $request)
    {
        $query = ReporteAvance::with(['beca', 'becario', 'tutor'])->orderByDesc('fecha_reporte');

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('becario_id')) {
            $query->where('becario_id', $request->integer('becario_id'));
        }

        if ($request->filled('beca_id')) {
            $query->where('beca_id', $request->integer('beca_id'));
        }

        if ($request->filled('trimestre')) {
            $query->where('trimestre', $request->integer('trimestre'));
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->string('estado')->toString());
        }

        return ReporteAvanceResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        $beca = Beca::with(['tutor', 'becario'])->findOrFail($data['becaId']);

        if ($beca->tutor_id !== (int) $data['tutorId']) {
            return response()->json([
                'message' => 'El tutor seleccionado no coincide con la beca.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($beca->becario_id !== (int) $data['becarioId']) {
            return response()->json([
                'message' => 'El becario seleccionado no coincide con la beca.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $reporte = ReporteAvance::create([
            'beca_id' => $beca->id,
            'becario_id' => $beca->becario_id,
            'tutor_id' => $beca->tutor_id,
            'carrera' => $data['carrera'],
            'universitario' => $data['universitario'],
            'proyecto' => $data['proyecto'],
            'trimestre' => $data['trimestre'],
            'porcentaje_avance' => $data['porcentajeAvance'],
            'fecha_reporte' => $data['fechaReporte'],
            'actividades' => $this->formatActividades($data['actividades']),
            'observaciones' => $data['observaciones'] ?? null,
            'estado' => $data['estado'] ?? 'Pendiente',
            'firmado_tutor' => (bool) ($data['firmaTutor'] ?? false),
            'firmado_becario' => (bool) ($data['firmaBecario'] ?? false),
            'firmado_director' => (bool) ($data['firmaDirector'] ?? false),
        ]);

        $reporte->load(['beca', 'becario', 'tutor']);

        return (new ReporteAvanceResource($reporte))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(ReporteAvance $reporteAvance)
    {
        $reporteAvance->load(['beca', 'becario', 'tutor']);

        return new ReporteAvanceResource($reporteAvance);
    }

    public function update(Request $request, ReporteAvance $reporteAvance)
    {
        $data = $this->validatePayload($request);

        if ($reporteAvance->tutor_id !== (int) $data['tutorId']) {
            return response()->json([
                'message' => 'Solo el tutor asignado puede actualizar el reporte.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($reporteAvance->becario_id !== (int) $data['becarioId']) {
            return response()->json([
                'message' => 'El becario proporcionado no coincide con el reporte.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($reporteAvance->beca_id !== (int) $data['becaId']) {
            return response()->json([
                'message' => 'La beca seleccionada no coincide con el reporte.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $reporteAvance->fill([
            'carrera' => $data['carrera'],
            'universitario' => $data['universitario'],
            'proyecto' => $data['proyecto'],
            'trimestre' => $data['trimestre'],
            'porcentaje_avance' => $data['porcentajeAvance'],
            'fecha_reporte' => $data['fechaReporte'],
            'actividades' => $this->formatActividades($data['actividades']),
            'observaciones' => $data['observaciones'] ?? null,
            'estado' => $data['estado'] ?? $reporteAvance->estado,
            'firmado_tutor' => array_key_exists('firmaTutor', $data)
                ? (bool) $data['firmaTutor']
                : $reporteAvance->firmado_tutor,
            'firmado_becario' => array_key_exists('firmaBecario', $data)
                ? (bool) $data['firmaBecario']
                : $reporteAvance->firmado_becario,
            'firmado_director' => array_key_exists('firmaDirector', $data)
                ? (bool) $data['firmaDirector']
                : $reporteAvance->firmado_director,
        ])->save();

        $reporteAvance->load(['beca', 'becario', 'tutor']);

        return new ReporteAvanceResource($reporteAvance);
    }

    public function destroy(ReporteAvance $reporteAvance)
    {
        $reporteAvance->delete();

        return response()->noContent();
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'becaId' => ['required', 'integer', Rule::exists('becas', 'id')],
            'becarioId' => ['required', 'integer', Rule::exists('users', 'id')],
            'tutorId' => ['required', 'integer', Rule::exists('users', 'id')],
            'carrera' => ['required', 'string', 'max:255'],
            'universitario' => ['required', 'string', 'max:255'],
            'proyecto' => ['required', 'string', 'max:255'],
            'trimestre' => ['required', 'integer', Rule::in([1, 2, 3, 4])],
            'porcentajeAvance' => ['required', 'integer', 'between:0,100'],
            'fechaReporte' => ['required', 'date'],
            'observaciones' => ['nullable', 'string'],
            'estado' => ['nullable', 'string', Rule::in(['Pendiente', 'Firmado', 'Observado'])],
            'actividades' => ['required', 'array', 'min:1'],
            'actividades.*.fecha' => ['required', 'date'],
            'actividades.*.actividad' => ['required', 'string', 'max:500'],
            'actividades.*.resultado' => ['required', 'string', 'max:255'],
            'firmaTutor' => ['nullable', 'boolean'],
            'firmaBecario' => ['nullable', 'boolean'],
            'firmaDirector' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param array<int, array<string, mixed>> $actividades
     * @return array<int, array<string, mixed>>
     */
    private function formatActividades(array $actividades): array
    {
        return collect($actividades)
            ->map(function (array $actividad, int $index) {
                return [
                    'numero' => $index + 1,
                    'fecha' => $actividad['fecha'],
                    'actividad' => $actividad['actividad'],
                    'resultado' => $actividad['resultado'],
                ];
            })
            ->values()
            ->all();
    }
}
