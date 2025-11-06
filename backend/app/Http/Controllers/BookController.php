<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    // Récupérer tous les livres (accessible à tous)
    public function index(Request $request)
    {
        try {
            $books = DB::table('books')
                ->leftJoin('categories', 'books.category_id', '=', 'categories.id')
                ->select(
                    'books.*',
                    'categories.name as category_name',
                    'categories.color as category_color'
                )
                ->orderBy('books.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'books' => $books
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des livres'
            ], 500);
        }
    }

    // Récupérer un livre par ID
    public function show($id)
    {
        try {
            $book = DB::table('books')
                ->leftJoin('categories', 'books.category_id', '=', 'categories.id')
                ->select(
                    'books.*',
                    'categories.name as category_name',
                    'categories.color as category_color'
                )
                ->where('books.id', $id)
                ->first();

            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Livre non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'book' => $book
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du livre'
            ], 500);
        }
    }

    // Créer un nouveau livre (admin uniquement)
    public function store(Request $request)
    {
        $userId = $request->header('User-Id', 1);
        $userRole = $request->header('User-Role', 'user');

        // Vérifier les permissions - admin uniquement
        if ($userRole !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les administrateurs peuvent ajouter des livres'
            ], 403);
        }

        try {
            $bookId = DB::table('books')->insertGetId([
                'title' => $request->title,
                'author' => $request->author,
                'isbn' => $request->isbn,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'publisher' => $request->publisher,
                'publication_year' => $request->publication_year,
                'pages' => $request->pages,
                'language' => $request->language ?? 'Français',
                'cover_image' => $request->cover_image,
                'total_copies' => $request->total_copies ?? 1,
                'available_copies' => $request->available_copies ?? 1,
                'location' => $request->location,
                'added_by' => $userId,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Livre ajouté avec succès',
                'book_id' => $bookId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout du livre'
            ], 500);
        }
    }

    // Récupérer les catégories
    public function categories()
    {
        try {
            $categories = DB::table('categories')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des catégories'
            ], 500);
        }
    }
}