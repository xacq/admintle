<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reporte extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'beca_id',
        'becario_id',
        'tutor_id',
        'titulo',
        'descripcion',
        'fecha_envio',
        'archivo',
        'archivo_nombre',
        'estado',
        'observaciones',
        'calificacion',
        'fecha_revision',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_envio' => 'datetime',
        'fecha_revision' => 'datetime',
        'calificacion' => 'integer',
    ];

    public function beca(): BelongsTo
    {
        return $this->belongsTo(Beca::class);
    }

    public function becario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'becario_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
