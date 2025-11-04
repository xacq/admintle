<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AuditLog */
class AuditLogResource extends JsonResource
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
            'usuario' => $this->usuario,
            'rol' => $this->rol,
            'accion' => $this->accion,
            'modulo' => $this->modulo,
            'resultado' => $this->resultado,
            'ip' => $this->ip,
            'dispositivo' => $this->dispositivo,
            'descripcion' => $this->descripcion,
            'datosPrevios' => $this->datos_previos,
            'datosPosteriores' => $this->datos_posteriores,
            'eventAt' => $this->event_at?->toIso8601String(),
            'usuarioId' => $this->user_id,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
