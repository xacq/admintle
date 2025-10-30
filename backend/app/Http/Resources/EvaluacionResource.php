<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Evaluacion */
class EvaluacionResource extends JsonResource
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
            'tutorId' => $this->tutor_id,
            'calificacionFinal' => $this->calificacion_final,
            'observacionesFinales' => $this->observaciones_finales,
            'estadoFinal' => $this->estado_final,
            'fechaRegistro' => $this->created_at?->toIso8601String(),
            'fechaActualizacion' => $this->updated_at?->toIso8601String(),
            'beca' => $this->whenLoaded('beca', function () {
                return [
                    'id' => $this->beca->id,
                    'codigo' => $this->beca->codigo,
                    'becario' => $this->beca->becario?->only(['id', 'name']),
                ];
            }),
        ];
    }
}
