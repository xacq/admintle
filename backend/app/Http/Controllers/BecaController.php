<?php

namespace App\Http\Controllers;

use App\Http\Resources\BecaResource;
use App\Models\Beca;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BecaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Beca::with(['becario', 'tutor', 'evaluacionFinal'])
            ->withAvg('reportes', 'calificacion')
            ->orderByDesc('created_at');

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('becario_id')) {
            $query->where('becario_id', $request->integer('becario_id'));
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
        ]);

        $beca->load(['becario', 'tutor', 'evaluacionFinal']);
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

        $beca->update([
            'codigo' => $data['codigo'],
            'becario_id' => $data['becarioId'],
            'tutor_id' => $data['tutorId'],
            'fecha_inicio' => $data['fechaInicio'],
            'fecha_fin' => $data['fechaFin'] ?? null,
            'estado' => $data['estado'],
        ]);

        $beca->load(['becario', 'tutor', 'evaluacionFinal']);
        $beca->loadAvg('reportes', 'calificacion');

        return new BecaResource($beca);
    }

    public function assignTutor(Request $request, Beca $beca)
    {
        $data = $this->validateTutorAssignment($request);

        $beca->update([
            'tutor_id' => $data['tutorId'],
        ]);

        $beca->load(['becario', 'tutor', 'evaluacionFinal']);
        $beca->loadAvg('reportes', 'calificacion');

        return new BecaResource($beca);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Beca $beca)
    {
        $beca->delete();

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateData(Request $request, ?Beca $beca = null): array
    {
        $estadoOptions = ['Activa', 'En evaluación', 'Finalizada'];
        $becaId = $beca?->id;

        $investigadorRoleId = Role::where('name', 'investigador')->value('id');
        $evaluadorRoleId = Role::where('name', 'evaluador')->value('id');

        return $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:255',
                Rule::unique('becas', 'codigo')->ignore($becaId),
            ],
            'becarioId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($investigadorRoleId) {
                    if ($investigadorRoleId) {
                        $query->where('role_id', $investigadorRoleId);
                    }
                }),
            ],
            'tutorId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($evaluadorRoleId) {
                    if ($evaluadorRoleId) {
                        $query->where('role_id', $evaluadorRoleId);
                    }
                }),
            ],
            'fechaInicio' => ['required', 'date'],
            'fechaFin' => ['nullable', 'date', 'after_or_equal:fechaInicio'],
            'estado' => ['required', 'string', Rule::in($estadoOptions)],
        ], [], [
            'becarioId' => 'becario',
            'tutorId' => 'tutor',
            'fechaInicio' => 'fecha de inicio',
            'fechaFin' => 'fecha de fin',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validateTutorAssignment(Request $request): array
    {
        $evaluadorRoleId = Role::where('name', 'evaluador')->value('id');

        return $request->validate([
            'tutorId' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) use ($evaluadorRoleId) {
                    if ($evaluadorRoleId) {
                        $query->where('role_id', $evaluadorRoleId);
                    }
                }),
            ],
        ], [], [
            'tutorId' => 'tutor',
        ]);
    }
}
