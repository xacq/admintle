<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ReporteAvance */
class ReporteAvanceResource extends JsonResource
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
            'becarioId' => $this->becario_id,
            'tutorId' => $this->tutor_id,
            'carrera' => $this->carrera,
            'universitario' => $this->universitario,
            'proyecto' => $this->proyecto,
            'trimestre' => $this->trimestre,
            'porcentajeAvance' => $this->porcentaje_avance,
            'fechaReporte' => $this->fecha_reporte?->toDateString(),
            'actividades' => $this->actividades ?? [],
            'observaciones' => $this->observaciones,
            'estado' => $this->estado,
            'firmadoTutor' => $this->firmado_tutor,
            'firmadoBecario' => $this->firmado_becario,
            'firmadoDirector' => $this->firmado_director,
            'beca' => $this->whenLoaded('beca', function () {
                return [
                    'id' => $this->beca->id,
                    'codigo' => $this->beca->codigo,
                    'tituloProyecto' => $this->beca->titulo_proyecto,
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
