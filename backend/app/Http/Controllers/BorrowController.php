<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NotificationController;

class BorrowController extends Controller
{
    // Faire une demande d'emprunt (utilisateurs certifiés uniquement)
    public function requestBorrow(Request $request)
    {
        $userId = $request->header('User-Id');
        $userStatus = $request->header('User-Status', 'pending');

        // Vérifier si l'utilisateur est certifié
        if ($userStatus !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les utilisateurs certifiés peuvent emprunter des livres. Veuillez attendre l\'approbation de votre compte.'
            ], 403);
        }

        try {
            // Vérifier si le livre existe et est disponible
            $book = DB::table('books')->where('id', $request->book_id)->first();
            
            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Livre non trouvé'
                ], 404);
            }

            if ($book->available_copies <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce livre n\'est pas disponible actuellement'
                ], 400);
            }

            // Vérifier si l'utilisateur n'a pas déjà une demande en cours pour ce livre
            $existingRequest = DB::table('borrow_requests')
                ->where('user_id', $userId)
                ->where('book_id', $request->book_id)
                ->whereIn('status', ['pending', 'approved', 'active'])
                ->first();

            if ($existingRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà une demande en cours pour ce livre'
                ], 400);
            }

            // Créer la demande d'emprunt
            $requestId = DB::table('borrow_requests')->insertGetId([
                'user_id' => $userId,
                'book_id' => $request->book_id,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Demande d\'emprunt envoyée avec succès',
                'request_id' => $requestId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la demande d\'emprunt'
            ], 500);
        }
    }

    // Récupérer les emprunts d'un utilisateur
    public function getUserBorrows(Request $request)
    {
        $userId = $request->header('User-Id');

        try {
            $borrows = DB::table('borrow_requests')
                ->join('books', 'borrow_requests.book_id', '=', 'books.id')
                ->leftJoin('categories', 'books.category_id', '=', 'categories.id')
                ->select(
                    'borrow_requests.*',
                    'books.title',
                    'books.author',
                    'books.cover_image',
                    'categories.name as category_name'
                )
                ->where('borrow_requests.user_id', $userId)
                ->orderBy('borrow_requests.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'borrows' => $borrows
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des emprunts'
            ], 500);
        }
    }

    // Approuver une demande d'emprunt (admin uniquement)
    public function approveBorrow(Request $request, $id)
    {
        $userRole = $request->header('User-Role', 'user');
        $adminId = $request->header('User-Id');

        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        try {
            // Récupérer la demande
            $borrowRequest = DB::table('borrow_requests')->where('id', $id)->first();
            
            if (!$borrowRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }

            // Mettre à jour la demande
            DB::table('borrow_requests')
                ->where('id', $id)
                ->update([
                    'status' => 'active',
                    'approved_by' => $adminId,
                    'approved_date' => now(),
                    'due_date' => now()->addDays(14),
                    'updated_at' => now()
                ]);

            // Décrémenter le nombre de copies disponibles
            DB::table('books')
                ->where('id', $borrowRequest->book_id)
                ->decrement('available_copies');

            // Créer une notification pour l'utilisateur
            $book = DB::table('books')->where('id', $borrowRequest->book_id)->first();
            NotificationController::createNotification(
                $borrowRequest->user_id,
                'Emprunt approuvé',
                "Votre demande d'emprunt pour \"" . $book->title . "\" a été approuvée. Vous pouvez venir récupérer le livre.",
                'success'
            );

            return response()->json([
                'success' => true,
                'message' => 'Demande d\'emprunt approuvée'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation'
            ], 500);
        }
    }

    // Récupérer toutes les demandes d'emprunt (admin)
    public function getAllBorrows(Request $request)
    {
        $userRole = $request->header('User-Role', 'user');

        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        try {
            $borrows = DB::table('borrow_requests')
                ->join('books', 'borrow_requests.book_id', '=', 'books.id')
                ->join('users', 'borrow_requests.user_id', '=', 'users.id')
                ->select(
                    'borrow_requests.*',
                    'books.title',
                    'books.author',
                    'users.name as user_name',
                    'users.email as user_email'
                )
                ->orderBy('borrow_requests.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'borrows' => $borrows
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des emprunts'
            ], 500);
        }
    }
}