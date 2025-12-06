<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'scholarship_code',
        'project_title',
        'student_user_id',
        'tutor_user_id',
        'career_id',
        'start_date',
        'end_date',
        'year',
        'status',
        'final_evaluation',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relación: Una beca pertenece a una carrera
    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    // Relación: El estudiante dueño de la beca
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    // Relación: El tutor asignado
    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_user_id');
    }
    
    // Relación con los reportes (la crearemos en el paso 5)
    // public function reports() { return $this->hasMany(Report::class); }
}