<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Récupérer le profil utilisateur
    public function profile(Request $request)
    {
        $userId = $request->header('User-Id');

        try {
            $user = DB::table('users')
                ->select('id', 'name', 'email', 'phone', 'address', 'status', 'role', 'registration_date')
                ->where('id', $userId)
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil'
            ], 500);
        }
    }

    // Inscription d'un nouvel utilisateur
    public function register(Request $request)
    {
        try {
            // Vérifier si l'email existe déjà
            $existingUser = DB::table('users')->where('email', $request->email)->first();
            
            if ($existingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cet email est déjà utilisé'
                ], 400);
            }

            // Créer l'utilisateur
            $userId = DB::table('users')->insertGetId([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
                'motivation' => $request->motivation,
                'status' => 'pending', // En attente d'approbation
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie. Votre compte est en attente d\'approbation.',
                'user_id' => $userId,
                'matricule' => 'ELB' . str_pad($userId, 6, '0', STR_PAD_LEFT)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription'
            ], 500);
        }
    }

    // Récupérer tous les utilisateurs (admin)
    public function getAllUsers(Request $request)
    {
        $userRole = $request->header('User-Role', 'user');

        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        try {
            $users = DB::table('users')
                ->select('id', 'name', 'email', 'phone', 'status', 'role', 'registration_date', 'motivation')
                ->orderBy('registration_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs'
            ], 500);
        }
    }

    // Approuver un utilisateur (admin)
    public function approveUser(Request $request, $id)
    {
        $userRole = $request->header('User-Role', 'user');

        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        try {
            DB::table('users')
                ->where('id', $id)
                ->update([
                    'status' => 'approved',
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur approuvé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation'
            ], 500);
        }
    }

    // Rejeter un utilisateur (admin)
    public function rejectUser(Request $request, $id)
    {
        $userRole = $request->header('User-Role', 'user');

        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        try {
            DB::table('users')
                ->where('id', $id)
                ->update([
                    'status' => 'rejected',
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur rejeté'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet'
            ], 500);
        }
    }
}