<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::with('category');
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
        }
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->get('category_id'));
        }
        
        $books = $query->paginate(12);
        return response()->json($books);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books',
            'category_id' => 'required|exists:categories,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string'
        ]);

        $validated['available_quantity'] = $validated['quantity'];
        $book = Book::create($validated);
        
        return response()->json($book->load('category'), 201);
    }

    public function show(Book $book): JsonResponse
    {
        return response()->json($book->load('category'));
    }

    public function update(Request $request, Book $book): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'isbn' => 'string|unique:books,isbn,' . $book->id,
            'category_id' => 'exists:categories,id',
            'quantity' => 'integer|min:1',
            'description' => 'nullable|string'
        ]);

        $book->update($validated);
        return response()->json($book->load('category'));
    }

    public function destroy(Book $book): JsonResponse
    {
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}