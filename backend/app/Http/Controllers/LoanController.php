<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    public function requestBorrow(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id'
        ]);

        $book = Book::find($validated['book_id']);
        
        if ($book->available_quantity <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ce livre n\'est pas disponible'
            ], 400);
        }

        // Créer l'emprunt
        $loan = Loan::create([
            'user_id' => Auth::id() ?? 1, // Utiliser l'utilisateur connecté ou ID 1 par défaut
            'book_id' => $validated['book_id'],
            'loan_date' => now(),
            'due_date' => now()->addDays(14),
            'status' => 'active'
        ]);

        // Décrémenter la quantité disponible
        $book->decrement('available_quantity');

        return response()->json([
            'success' => true,
            'message' => 'Emprunt créé avec succès',
            'loan' => $loan->load(['book', 'user'])
        ]);
    }

    public function myBorrows(): JsonResponse
    {
        $loans = Loan::with(['book.category'])
            ->where('user_id', Auth::id() ?? 1)
            ->orderBy('loan_date', 'desc')
            ->get()
            ->map(function ($loan) {
                return [
                    'id' => $loan->id,
                    'title' => $loan->book->title,
                    'author' => $loan->book->author,
                    'date_emprunt' => $loan->loan_date,
                    'date_retour_prevue' => $loan->due_date,
                    'date_retour_effective' => $loan->return_date,
                    'status' => $loan->status
                ];
            });

        return response()->json($loans);
    }

    public function returnBook(Loan $loan): JsonResponse
    {
        if ($loan->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Ce livre a déjà été retourné'
            ], 400);
        }

        $loan->update([
            'return_date' => now(),
            'status' => 'returned'
        ]);

        // Incrémenter la quantité disponible
        $loan->book->increment('available_quantity');

        return response()->json([
            'success' => true,
            'message' => 'Livre retourné avec succès'
        ]);
    }

    public function index(): JsonResponse
    {
        $loans = Loan::with(['book', 'user'])
            ->orderBy('loan_date', 'desc')
            ->get();

        return response()->json($loans);
    }
}