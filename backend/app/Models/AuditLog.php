<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'usuario',
        'rol',
        'accion',
        'modulo',
        'resultado',
        'ip',
        'dispositivo',
        'descripcion',
        'datos_previos',
        'datos_posteriores',
        'event_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'event_at' => 'datetime',
        'datos_previos' => 'array',
        'datos_posteriores' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
