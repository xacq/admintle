<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username', // SE MANTIENE
        'password',
        'is_active', // SE MANTIENE
        'role_id',   // SE MANTIENE (Relación con tabla roles)
        
        // --- NUEVOS CAMPOS ---
        'career_id',
        'university_member_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean', // SE MANTIENE
        ];
    }

    // --- RELACIONES EXISTENTES ---
    
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // --- RELACIONES NUEVAS ---

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    public function universityMember(): BelongsTo
    {
        return $this->belongsTo(UniversityMember::class);
    }
    
    // Helper opcional: Para verificar roles usando el nombre del rol (asumiendo que tu tabla roles tiene columna 'name')
    public function hasRole($roleName)
    {
        return $this->role && $this->role->name === $roleName;
    }
}