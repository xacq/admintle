<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReporteResource;
use App\Models\Beca;
use App\Models\Reporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ReporteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reporte::with(['beca.evaluacionFinal', 'becario', 'tutor'])->orderByDesc('fecha_envio');

        if ($request->filled('becario_id')) {
            $query->where('becario_id', $request->integer('becario_id'));
        }

        if ($request->filled('tutor_id')) {
            $query->where('tutor_id', $request->integer('tutor_id'));
        }

        if ($request->filled('beca_id')) {
            $query->where('beca_id', $request->integer('beca_id'));
        }

        if ($request->filled('estado')) {
            $estado = $request->string('estado')->toString();
            $query->where('estado', $estado);
        }

        return ReporteResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'becaId' => ['required', 'integer', Rule::exists('becas', 'id')],
            'becarioId' => ['required', 'integer', Rule::exists('users', 'id')],
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'archivo' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
        ], [], [
            'becaId' => 'beca',
            'becarioId' => 'becario',
        ]);

        /** @var Beca $beca */
        $beca = Beca::with('tutor')->findOrFail($data['becaId']);

        if ($beca->becario_id !== (int) $data['becarioId']) {
            return response()->json([
                'message' => 'La beca seleccionada no pertenece al becario autenticado.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $file = $data['archivo'];
        $path = $file->store('reportes', 'public');

        $reporte = Reporte::create([
            'beca_id' => $beca->id,
            'becario_id' => $beca->becario_id,
            'tutor_id' => $beca->tutor_id,
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'] ?? null,
            'fecha_envio' => now(),
            'archivo' => $path,
            'archivo_nombre' => $file->getClientOriginalName(),
            'estado' => 'Pendiente',
        ]);

        $reporte->load(['beca.evaluacionFinal', 'becario', 'tutor']);

        return (new ReporteResource($reporte))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reporte $reporte)
    {
        $reporte->load(['beca.evaluacionFinal', 'becario', 'tutor']);

        return new ReporteResource($reporte);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reporte $reporte)
    {
        $data = $request->validate([
            'estado' => ['required', 'string', Rule::in(['Pendiente', 'Aprobado', 'Devuelto'])],
            'observaciones' => ['nullable', 'string'],
            'calificacion' => ['nullable', 'integer', 'between:0,100'],
        ]);

        $reporte->fill([
            'estado' => $data['estado'],
            'observaciones' => $data['observaciones'] ?? null,
            'calificacion' => $data['calificacion'] ?? null,
            'fecha_revision' => now(),
        ])->save();

        $reporte->load(['beca.evaluacionFinal', 'becario', 'tutor']);

        return new ReporteResource($reporte);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reporte $reporte)
    {
        Storage::disk('public')->delete($reporte->archivo);
        $reporte->delete();

        return response()->noContent();
    }

    public function download(Reporte $reporte)
    {
        if (! Storage::disk('public')->exists($reporte->archivo)) {
            abort(Response::HTTP_NOT_FOUND, 'El archivo no está disponible.');
        }

        return Storage::disk('public')->download($reporte->archivo, $reporte->archivo_nombre);
    }
}
