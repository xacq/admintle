<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemParameter extends Model
{
    protected $fillable = [
        'academic_year',
        'management_start_date',
        'management_end_date',
        'report_deadline',
        'max_reports_per_scholar',
        'system_status',
        'research_lines',
    ];

    protected $casts = [
        'management_start_date' => 'date',
        'management_end_date' => 'date',
        'report_deadline' => 'date',
        'max_reports_per_scholar' => 'integer',
        'research_lines' => 'array',
    ];
}
