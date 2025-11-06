<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        // Admin par défaut
        if ($email === 'admin' && $password === 'admin') {
            return response()->json([
                'success' => true,
                'token' => 'admin-token-' . time(),
                'user' => [
                    'id' => 1,
                    'name' => 'Admin',
                    'email' => 'admin',
                    'role' => 'admin'
                ]
            ]);
        }

        // Admin avec email
        if ($email === 'admin@elibrary.com' && $password === 'admin123') {
            return response()->json([
                'success' => true,
                'token' => 'admin-token-' . time(),
                'user' => [
                    'id' => 1,
                    'name' => 'Admin',
                    'email' => 'admin@elibrary.com',
                    'role' => 'admin'
                ]
            ]);
        }

        // Vérifier dans la base de données
        try {
            $user = DB::table('users')
                ->where('email', $email)
                ->first();

            if ($user && Hash::check($password, $user->password)) {
                return response()->json([
                    'success' => true,
                    'token' => 'user-token-' . time(),
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role ?? 'user'
                    ]
                ]);
            }
        } catch (\Exception $e) {
            // Base de données non disponible, continuer avec les comptes par défaut
        }

        return response()->json([
            'success' => false,
            'message' => 'Identifiants incorrects'
        ], 401);
    }

    public function register(Request $request)
    {
        // Simuler l'inscription
        return response()->json([
            'success' => true,
            'message' => 'Compte créé avec succès',
            'matricule' => 'ELB' . rand(100000, 999999)
        ]);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }
}