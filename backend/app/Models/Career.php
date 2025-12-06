<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'faculty'];
    
    // Opcional: Relación con usuarios (si ya tienes el modelo User modificado)
    public function users()
    {
        return $this->hasMany(User::class);
    }
}