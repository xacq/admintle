<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Beca extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'codigo',
        'becario_id',
        'tutor_id',
        'fecha_inicio',
        'fecha_fin',
        'fecha_cierre',
        'cerrada_por',
        'archivada',
        'fecha_archivo',
        'estado',
        'titulo_proyecto',
        'area_investigacion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'fecha_cierre' => 'datetime',
        'fecha_archivo' => 'datetime',
        'archivada' => 'bool',
    ];

    public function becario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'becario_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function cerradaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cerrada_por');
    }

    public function reportes(): HasMany
    {
        return $this->hasMany(Reporte::class);
    }

    public function evaluacionFinal(): HasOne
    {
        return $this->hasOne(Evaluacion::class);
    }
}
