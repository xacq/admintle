<?php

namespace App\Http\Controllers;

use App\Http\Resources\BecaResource;
use App\Models\Beca;
use App\Models\Role;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BecaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Beca::with(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor'])
            ->withAvg('reportes', 'calificacion')
            ->orderByDesc('created_at');

        $estadoFiltro = $request->input('estado');

        if (! $request->boolean('include_archived') && $estadoFiltro !== 'Archivada') {
            $query->where('archivada', false);
        }

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('becario_id')) {
            $query->where('becario_id', $request->integer('becario_id'));
        }

        if ($estadoFiltro) {
            $query->where('estado', $estadoFiltro);
        }

        if ($request->boolean('only_active')) {
            $query->where('estado', 'Activa');
        }

        return BecaResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $this->validateData($request);

        $beca = Beca::create([
            'codigo' => $data['codigo'],
            'becario_id' => $data['becarioId'],
            'tutor_id' => $data['tutorId'],
            'fecha_inicio' => $data['fechaInicio'],
            'fecha_fin' => $data['fechaFin'] ?? null,
            'estado' => $data['estado'],
            'titulo_proyecto' => $data['tituloProyecto'],
            'area_investigacion' => $data['areaInvestigacion'],
            'archivada' => false,
            'fecha_archivo' => null,
            'fecha_cierre' => null,
            'cerrada_por' => null,
        ]);

        $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
        $beca->loadAvg('reportes', 'calificacion');

        return (new BecaResource($beca))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Beca $beca)
    {
        $data = $this->validateData($request, $beca);

        if ($beca->estado === 'Archivada') {
            return response()->json([
                'message' => 'No es posible modificar una beca que ya fue archivada.',
            ], 422);
        }

        $beca->update([
            'codigo' => $data['codigo'],
            'becario_id' => $data['becarioId'],
            'tutor_id' => $data['tutorId'],
            'fecha_inicio' => $data['fechaInicio'],
            'fecha_fin' => $data['fechaFin'] ?? null,
            'estado' => $data['estado'],
            'titulo_proyecto' => $data['tituloProyecto'],
            'area_investigacion' => $data['areaInvestigacion'],
        ]);

        $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
        $beca->loadAvg('reportes', 'calificacion');

        return new BecaResource($beca);
    }

    public function assignTutor(Request $request, Beca $beca)
    {
        if ($beca->estado === 'Archivada') {
            return response()->json([
                'message' => 'No es posible reasignar tutores a una beca archivada.',
            ], 422);
        }

        $data = $this->validateTutorAssignment($request);

        $beca->update([
            'tutor_id' => $data['tutorId'],
        ]);

        $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
        $beca->loadAvg('reportes', 'calificacion');

        return new BecaResource($beca);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Beca $beca)
    {
        if ($beca->estado === 'Archivada') {
            return response()->json([
                'message' => 'No es posible eliminar becas archivadas.',
            ], 422);
        }

        $beca->delete();

        return response()->noContent();
    }

    public function archive(Request $request, Beca $beca)
    {
        $beca->loadMissing('evaluacionFinal');

        if (! $beca->evaluacionFinal) {
            return response()->json([
                'message' => 'La beca debe contar con una evaluación final antes de archivarse.',
            ], 422);
        }

        $data = $this->validateArchive($request);

        if ($beca->estado === 'Archivada' && $beca->archivada) {
            $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
            $beca->loadAvg('reportes', 'calificacion');

            return (new BecaResource($beca))
                ->response()
                ->setStatusCode(200);
        }

        $now = Carbon::now();

        $updates = [
            'estado' => 'Archivada',
            'archivada' => true,
            'fecha_archivo' => $now,
        ];

        if (! $beca->fecha_cierre) {
            $updates['fecha_cierre'] = $now;
        }

        if (array_key_exists('cerradaPorId', $data)) {
            $updates['cerrada_por'] = $data['cerradaPorId'];
        }

        $beca->update($updates);

        $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
        $beca->loadAvg('reportes', 'calificacion');

        return new BecaResource($beca);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Beca $beca)
    {
        if ($beca->estado === 'Archivada' && ! $request->boolean('include_archived')) {
            return response()->json([
                'message' => 'La beca solicitada pertenece al archivo histórico.',
            ], 404);
        }

        $beca->load(['becario.role', 'tutor.role', 'evaluacionFinal', 'cerradaPor']);
        $beca->loadAvg('reportes', 'calificacion');

        if (! $beca->archivada && $beca->estado === 'Archivada') {
            $beca->forceFill([
                'archivada' => true,
                'fecha_archivo' => $beca->fecha_archivo ?? $beca->fecha_cierre,
            ])->save();
        }

        return new BecaResource($beca);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateData(Request $request, ?Beca $beca = null): array
    {
        $estadoOptions = ['Activa', 'En evaluación', 'Finalizada'];

        if ($beca && $beca->estado === 'Archivada') {
            $estadoOptions[] = 'Archivada';
        }
        $becaId = $beca?->id;

        $becarioRoles = Role::whereIn('name', ['investigador', 'becario'])
            ->pluck('id')
            ->all();
        $tutorRoleId = Role::where('name', 'tutor')->value('id');

        $data = $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:255',
                Rule::unique('becas', 'codigo')->ignore($becaId),
            ],
            'becarioId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($becarioRoles) {
                    if (! empty($becarioRoles)) {
                        $query->whereIn('role_id', $becarioRoles);
                    }
                }),
            ],
            'tutorId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($tutorRoleId) {
                    if ($tutorRoleId) {
                        $query->where('role_id', $tutorRoleId);
                    }
                }),
            ],
            'fechaInicio' => ['required', 'date'],
            'fechaFin' => ['nullable', 'date', 'after_or_equal:fechaInicio'],
            'estado' => ['required', 'string', Rule::in($estadoOptions)],
            'tituloProyecto' => ['nullable', 'string', 'max:255'],
            'areaInvestigacion' => ['nullable', 'string', 'max:255'],
        ], [], [
            'becarioId' => 'becario',
            'tutorId' => 'tutor',
            'fechaInicio' => 'fecha de inicio',
            'fechaFin' => 'fecha de fin',
        ]);

        foreach (['tituloProyecto', 'areaInvestigacion'] as $attribute) {
            if (array_key_exists($attribute, $data)) {
                $data[$attribute] = trim((string) $data[$attribute]) ?: null;
            } else {
                $data[$attribute] = null;
            }
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateTutorAssignment(Request $request): array
    {
        $tutorRoleId = Role::where('name', 'tutor')->value('id');

        return $request->validate([
            'tutorId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($tutorRoleId) {
                    if ($tutorRoleId) {
                        $query->where('role_id', $tutorRoleId);
                    }
                }),
            ],
        ], [], [
            'tutorId' => 'tutor',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateArchive(Request $request): array
    {
        $roles = Role::whereIn('name', ['administrador', 'director'])
            ->pluck('id')
            ->all();

        return $request->validate([
            'cerradaPorId' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($roles) {
                    if (! empty($roles)) {
                        $query->whereIn('role_id', $roles);
                    }
                }),
            ],
        ], [], [
            'cerradaPorId' => 'responsable de cierre',
        ]);
    }
}
