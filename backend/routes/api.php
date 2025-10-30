<?php

use App\Http\Controllers\BecaController;
use App\Http\Controllers\EvaluacionController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ReporteInstitucionalController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

Route::middleware('api')->group(function () {
    Route::apiResource('becas', BecaController::class)->except(['show']);
    Route::patch('/becas/{beca}/tutor', [BecaController::class, 'assignTutor']);
    Route::apiResource('reportes', ReporteController::class);
    Route::get('/reportes/{reporte}/archivo', [ReporteController::class, 'download'])
        ->name('reportes.download');
    Route::get('/reportes-institucionales/resumen', [ReporteInstitucionalController::class, 'summary']);
    Route::apiResource('evaluaciones', EvaluacionController::class)->only(['index', 'store', 'update']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users/{user}/toggle', [UserController::class, 'toggle']);
    Route::get('/roles', [UserController::class, 'roles']);

    Route::get('/roles/{role}/usuarios', function (string $role) {
        return DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select('users.id', 'users.name')
            ->where('roles.name', $role)
            ->orderBy('users.name')
            ->get();
    });

    Route::get('/designaciones', function () {
        return DB::table('designaciones')
            ->select('id', 'fecha', 'empleado', 'puesto', 'departamento', 'estado')
            ->orderByDesc('fecha')
            ->get();
    });

    Route::get('/historial-estudiantes', function () {
        return DB::table('historial_estudiantes')
            ->select('id', 'full_name as fullName', 'repetidos', 'nota')
            ->orderBy('full_name')
            ->get();
    });

    Route::get('/estudiantes', function () {
        return DB::table('estudiantes')
            ->select('id', 'ru', 'name', 'ci', 'nota', 'celular')
            ->orderBy('name')
            ->get();
    });

    Route::get('/materias', function () {
        return DB::table('materias')
            ->select('id', 'name', 'agu', 'nickname', 'details')
            ->orderBy('name')
            ->get()
            ->map(function ($row) {
                $row->details = json_decode($row->details, true);
                return $row;
            });
    });

    Route::get('/notificaciones', function (Request $request) {
        $validCategories = ['actual', 'anterior', 'registro'];
        $category = $request->query('category');

        return DB::table('notificaciones')
            ->select('id', 'numero', 'titulo', 'descripcion', 'hasta', 'categoria')
            ->when(in_array($category, $validCategories, true), function ($query) use ($category) {
                $query->where('categoria', $category);
            })
            ->orderBy('numero')
            ->get();
    });

    Route::post('/login', function (Request $request) {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id',
                'users.name',
                'users.username',
                'users.password',
                'roles.name as role',
                'roles.display_name as roleLabel',
                'roles.dashboard_route as dashboardRoute'
            )
            ->where('users.username', $validated['username'])
            ->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Las credenciales proporcionadas no son válidas.'],
            ]);
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'roleLabel' => $user->roleLabel,
            'dashboardRoute' => $user->dashboardRoute,
        ];
    });
});
