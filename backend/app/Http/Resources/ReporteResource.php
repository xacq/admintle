<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Reporte */
class ReporteResource extends JsonResource
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
            'becaId' => $this->beca_id,
            'titulo' => $this->titulo,
            'descripcion' => $this->descripcion,
            'estado' => $this->estado,
            'fechaEnvio' => $this->fecha_envio?->toIso8601String(),
            'fechaRevision' => $this->fecha_revision?->toIso8601String(),
            'observaciones' => $this->observaciones,
            'calificacion' => $this->calificacion,
            'archivoNombre' => $this->archivo_nombre,
            'archivoUrl' => route('reportes.download', $this->resource),
            'beca' => $this->whenLoaded('beca', function () {
                return [
                    'id' => $this->beca->id,
                    'codigo' => $this->beca->codigo,
                    'evaluacionFinal' => $this->beca->evaluacionFinal ? [
                        'id' => $this->beca->evaluacionFinal->id,
                        'calificacionFinal' => $this->beca->evaluacionFinal->calificacion_final,
                        'observacionesFinales' => $this->beca->evaluacionFinal->observaciones_finales,
                        'estadoFinal' => $this->beca->evaluacionFinal->estado_final,
                        'fechaRegistro' => $this->beca->evaluacionFinal->created_at?->toIso8601String(),
                        'fechaActualizacion' => $this->beca->evaluacionFinal->updated_at?->toIso8601String(),
                    ] : null,
                ];
            }),
            'becario' => $this->whenLoaded('becario', function () {
                return [
                    'id' => $this->becario->id,
                    'nombre' => $this->becario->name,
                ];
            }),
            'tutor' => $this->whenLoaded('tutor', function () {
                return [
                    'id' => $this->tutor->id,
                    'nombre' => $this->tutor->name,
                ];
            }),
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
