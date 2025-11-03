<?php

namespace App\Http\Controllers;

use App\Http\Resources\BecaResource;
use App\Http\Resources\EvaluacionResource;
use App\Models\Beca;
use App\Models\Evaluacion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class EvaluacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Evaluacion::with(['beca.becario', 'beca.tutor'])->orderByDesc('created_at');

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('beca_id')) {
            $query->where('beca_id', $request->integer('beca_id'));
        }

        return EvaluacionResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $this->validateData($request);

        /** @var Beca $beca */
        $beca = Beca::with(['tutor', 'evaluacionFinal'])->findOrFail($data['becaId']);

        if ($beca->tutor_id !== (int) $data['tutorId']) {
            return response()->json([
                'message' => 'Solo el tutor asignado puede registrar la evaluación final de esta beca.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($beca->evaluacionFinal) {
            return response()->json([
                'message' => 'La beca ya cuenta con una evaluación final registrada.',
            ], Response::HTTP_CONFLICT);
        }

        $evaluacion = Evaluacion::create([
            'beca_id' => $beca->id,
            'tutor_id' => $data['tutorId'],
            'calificacion_final' => $data['calificacionFinal'],
            'observaciones_finales' => $data['observacionesFinales'] ?? null,
            'estado_final' => $data['estadoFinal'],
        ]);

        $this->syncBecaEstado($beca, $data['estadoFinal']);

        return $this->becaResponse($beca->id)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evaluacion $evaluacion)
    {
        $data = $this->validateData($request, $evaluacion);

        /** @var Beca $beca */
        $beca = Beca::with('tutor')->findOrFail($evaluacion->beca_id);

        if ($beca->tutor_id !== (int) $data['tutorId']) {
            return response()->json([
                'message' => 'Solo el tutor asignado puede actualizar la evaluación final de esta beca.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($evaluacion->beca_id !== (int) $data['becaId']) {
            return response()->json([
                'message' => 'No es posible reasignar la evaluación a otra beca.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $evaluacion->fill([
            'tutor_id' => $data['tutorId'],
            'calificacion_final' => $data['calificacionFinal'],
            'observaciones_finales' => $data['observacionesFinales'] ?? null,
            'estado_final' => $data['estadoFinal'],
        ])->save();

        $this->syncBecaEstado($beca, $data['estadoFinal']);

        return $this->becaResponse($beca->id);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateData(Request $request, ?Evaluacion $evaluacion = null): array
    {
        $estadoOptions = ['Pendiente', 'Aprobado', 'Reprobado', 'Concluido'];

        $messages = [
            'becaId.unique' => 'La beca ya cuenta con una evaluación final registrada.',
        ];

        $data = $request->validate([
            'becaId' => [
                'required',
                'integer',
                Rule::exists('becas', 'id'),
                Rule::unique('evaluaciones', 'beca_id')->ignore($evaluacion?->id),
            ],
            'tutorId' => ['required', 'integer', Rule::exists('users', 'id')],
            'calificacionFinal' => ['nullable', 'numeric', 'between:0,10'],
            'observacionesFinales' => ['nullable', 'string'],
            'estadoFinal' => ['required', 'string', Rule::in($estadoOptions)],
        ], $messages, [
            'becaId' => 'beca',
            'tutorId' => 'tutor',
            'calificacionFinal' => 'calificación final',
            'observacionesFinales' => 'observaciones finales',
            'estadoFinal' => 'estado final',
        ]);

        if (in_array($data['estadoFinal'], ['Aprobado', 'Reprobado'], true) && $data['calificacionFinal'] === null) {
            $request->validate([
                'calificacionFinal' => ['required'],
            ]);
        }

        if ($data['calificacionFinal'] !== null) {
            $data['calificacionFinal'] = round((float) $data['calificacionFinal'], 2);
        }

        return $data;
    }

    protected function syncBecaEstado(Beca $beca, string $estadoFinal): void
    {
        if ($beca->estado === 'Archivada') {
            return;
        }

        if (in_array($estadoFinal, ['Aprobado', 'Reprobado', 'Concluido'], true)) {
            if ($beca->estado !== 'Finalizada') {
                $beca->update(['estado' => 'Finalizada']);
            }
        }
    }

    protected function becaResponse(int $becaId): BecaResource
    {
        $beca = Beca::with(['becario', 'tutor', 'evaluacionFinal'])
            ->withAvg('reportes', 'calificacion')
            ->findOrFail($becaId);

        return new BecaResource($beca);
    }
}
