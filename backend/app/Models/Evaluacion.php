<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluacion extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'beca_id',
        'tutor_id',
        'calificacion_final',
        'observaciones_finales',
        'estado_final',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'calificacion_final' => 'float',
    ];

    public function beca(): BelongsTo
    {
        return $this->belongsTo(Beca::class);
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
