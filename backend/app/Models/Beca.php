<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Beca extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'becario_id',
        'tutor_id',
        'fecha_inicio',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
    ];

    public function becario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'becario_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
