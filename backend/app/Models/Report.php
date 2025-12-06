<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'scholarship_id',
        'report_number',
        'deadline_start',
        'deadline_end',
        'production_date',
        'problem_description',
        'file_path',
        'status',
        'tutor_feedback',
    ];

    protected $casts = [
        'deadline_start' => 'date',
        'deadline_end' => 'date',
        'production_date' => 'date',
    ];

    // Relación: Un informe pertenece a una beca
    public function scholarship(): BelongsTo
    {
        return $this->belongsTo(Scholarship::class);
    }
    
    // Helper para saber si está aprobado
    public function isApproved()
    {
        return $this->status === 'approved';
    }
}