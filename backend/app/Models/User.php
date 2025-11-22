<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'photo_url'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function isLibrarian(): bool
    {
        return $this->role === 'librarian';
    }
}