<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityMember extends Model
{
    use HasFactory;

    protected $fillable = ['full_name', 'ci', 'type', 'career_id'];

    public function career()
    {
        return $this->belongsTo(Career::class);
    }
    
    // Relación opcional con el usuario del sistema (para futuro)
    public function user()
    {
        return $this->hasOne(User::class);
    }
}