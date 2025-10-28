<?php

namespace App\Http\Controllers;

use App\Models\Beca;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BecaController extends Controller
{
    private const ESTADOS = ['Activa', 'En evaluación', 'Finalizada'];

    public function index(Request $request): JsonResponse
    {
        $query = Beca::query()->with([
            'becario.role',
            'tutor.role',
        ])->orderBy('codigo');

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('becario_id')) {
            $query->where('becario_id', $request->integer('becario_id'));
        }

        $becas = $query->get()->map(fn (Beca $beca) => $this->transformBeca($beca));

        return response()->json($becas);
    }

    public function store(Request $request): JsonResponse
    {
        [$becarioRule, $tutorRule] = $this->roleRules();

        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:50', 'unique:becas,codigo'],
            'becario_id' => ['required', 'integer', $becarioRule],
            'tutor_id' => ['required', 'integer', $tutorRule],
            'fecha_inicio' => ['required', 'date'],
            'estado' => ['required', 'string', Rule::in(self::ESTADOS)],
        ]);

        $beca = Beca::create($validated)->load(['becario.role', 'tutor.role']);

        return response()->json($this->transformBeca($beca), 201);
    }

    public function update(Request $request, Beca $beca): JsonResponse
    {
        [$becarioRule, $tutorRule] = $this->roleRules();

        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:50', Rule::unique('becas', 'codigo')->ignore($beca->id)],
            'becario_id' => ['required', 'integer', $becarioRule],
            'tutor_id' => ['required', 'integer', $tutorRule],
            'fecha_inicio' => ['required', 'date'],
            'estado' => ['required', 'string', Rule::in(self::ESTADOS)],
        ]);

        $beca->update($validated);
        $beca->load(['becario.role', 'tutor.role']);

        return response()->json($this->transformBeca($beca));
    }

    public function destroy(Beca $beca): JsonResponse
    {
        $beca->delete();

        return response()->json(null, 204);
    }

    public function options(): JsonResponse
    {
        $roles = Role::whereIn('name', ['becario', 'tutor'])->pluck('id', 'name');

        $becarios = User::query()
            ->select('id', 'name')
            ->when(isset($roles['becario']), fn ($query) => $query->where('role_id', $roles['becario']))
            ->orderBy('name')
            ->get();

        $tutores = User::query()
            ->select('id', 'name')
            ->when(isset($roles['tutor']), fn ($query) => $query->where('role_id', $roles['tutor']))
            ->orderBy('name')
            ->get();

        return response()->json([
            'becarios' => $becarios,
            'tutores' => $tutores,
            'estados' => self::ESTADOS,
        ]);
    }

    private function transformBeca(Beca $beca): array
    {
        return [
            'id' => $beca->id,
            'codigo' => $beca->codigo,
            'fecha_inicio' => optional($beca->fecha_inicio)->toDateString(),
            'estado' => $beca->estado,
            'becario' => [
                'id' => $beca->becario?->id,
                'nombre' => $beca->becario?->name,
                'rol' => $beca->becario?->role?->display_name,
            ],
            'tutor' => [
                'id' => $beca->tutor?->id,
                'nombre' => $beca->tutor?->name,
                'rol' => $beca->tutor?->role?->display_name,
            ],
        ];
    }

    private function roleRules(): array
    {
        $roleIds = Role::whereIn('name', ['becario', 'tutor'])->pluck('id', 'name');

        $becarioRule = Rule::exists('users', 'id')->where(function ($query) use ($roleIds) {
            $query->where('role_id', $roleIds['becario'] ?? 0);
        });

        $tutorRule = Rule::exists('users', 'id')->where(function ($query) use ($roleIds) {
            $query->where('role_id', $roleIds['tutor'] ?? 0);
        });

        return [$becarioRule, $tutorRule];
    }
}
