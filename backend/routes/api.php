<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->prefix('api')->group(function () {
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
});
