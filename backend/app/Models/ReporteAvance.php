<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReporteAvance extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'beca_id',
        'becario_id',
        'tutor_id',
        'carrera',
        'universitario',
        'proyecto',
        'trimestre',
        'porcentaje_avance',
        'fecha_reporte',
        'actividades',
        'observaciones',
        'estado',
        'firmado_tutor',
        'firmado_becario',
        'firmado_director',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'actividades' => 'array',
        'fecha_reporte' => 'date',
        'porcentaje_avance' => 'integer',
        'trimestre' => 'integer',
        'firmado_tutor' => 'boolean',
        'firmado_becario' => 'boolean',
        'firmado_director' => 'boolean',
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
