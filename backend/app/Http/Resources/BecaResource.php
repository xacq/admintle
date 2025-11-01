<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Beca */
class BecaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'estado' => $this->estado,
            'tituloProyecto' => $this->titulo_proyecto,
            'areaInvestigacion' => $this->area_investigacion,
            'fechaInicio' => $this->fecha_inicio?->format('Y-m-d'),
            'fechaFin' => $this->fecha_fin?->format('Y-m-d'),
            'promedioReportes' => $this->reportes_avg_calificacion !== null
                ? round((float) $this->reportes_avg_calificacion, 2)
                : null,
            'fechaCierre' => $this->fecha_cierre?->toIso8601String(),
            'becario' => $this->whenLoaded('becario', function () {
                return [
                    'id' => $this->becario->id,
                    'nombre' => $this->becario->name,
                    'role' => $this->becario->role ? [
                        'id' => $this->becario->role->id,
                        'name' => $this->becario->role->name,
                        'displayName' => $this->becario->role->display_name,
                    ] : null,
                ];
            }),
            'tutor' => $this->whenLoaded('tutor', function () {
                return [
                    'id' => $this->tutor->id,
                    'nombre' => $this->tutor->name,
                    'role' => $this->tutor->role ? [
                        'id' => $this->tutor->role->id,
                        'name' => $this->tutor->role->name,
                        'displayName' => $this->tutor->role->display_name,
                    ] : null,
                ];
            }),
            'cerradaPor' => $this->whenLoaded('cerradaPor', function () {
                return [
                    'id' => $this->cerradaPor->id,
                    'nombre' => $this->cerradaPor->name,
                ];
            }),
            'evaluacionFinal' => $this->whenLoaded('evaluacionFinal', function () {
                return [
                    'id' => $this->evaluacionFinal->id,
                    'calificacionFinal' => $this->evaluacionFinal->calificacion_final,
                    'observacionesFinales' => $this->evaluacionFinal->observaciones_finales,
                    'estadoFinal' => $this->evaluacionFinal->estado_final,
                    'fechaRegistro' => $this->evaluacionFinal->created_at?->toIso8601String(),
                    'fechaActualizacion' => $this->evaluacionFinal->updated_at?->toIso8601String(),
                ];
            }),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
