<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query()->orderByDesc('event_at');

        if ($request->filled('usuario')) {
            $usuario = mb_strtolower($request->input('usuario'));
            $query->whereRaw('LOWER(usuario) LIKE ?', ['%' . $usuario . '%']);
        }

        if ($request->filled('accion')) {
            $accion = mb_strtolower($request->input('accion'));
            $query->whereRaw('LOWER(accion) LIKE ?', ['%' . $accion . '%']);
        }

        if ($request->filled('modulo')) {
            $modulo = mb_strtolower($request->input('modulo'));
            $query->whereRaw('LOWER(modulo) LIKE ?', ['%' . $modulo . '%']);
        }

        if ($request->filled('fecha_desde') && $request->filled('fecha_hasta')) {
            try {
                $desde = Carbon::parse($request->input('fecha_desde'))->startOfDay();
                $hasta = Carbon::parse($request->input('fecha_hasta'))->endOfDay();
                $query->whereBetween('event_at', [$desde, $hasta]);
            } catch (\Throwable $e) {
                // Ignorar errores de formato y continuar sin filtro de fechas
            }
        }

        $logs = $query->get();

        return AuditLogResource::collection($logs)->response();
    }
}
