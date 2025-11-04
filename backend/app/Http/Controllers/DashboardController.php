<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        try {
            // Compter directement dans la base
            $totalBooks = DB::table('books')->count();
            $totalUsers = DB::table('users')->where('role', 'student')->count();
            $activeLoans = DB::table('loans')->where('status', 'active')->count();
            $overdueLoans = DB::table('loans')
                ->where('status', 'active')
                ->where('due_date', '<', Carbon::now()->toDateString())
                ->count();

            // Livres populaires
            $popularBooks = DB::table('books')
                ->leftJoin('loans', 'books.id', '=', 'loans.book_id')
                ->leftJoin('categories', 'books.category_id', '=', 'categories.id')
                ->select('books.title', 'books.author', 'categories.name as category_name', 
                        DB::raw('COUNT(loans.id) as loans_count'))
                ->groupBy('books.id', 'books.title', 'books.author', 'categories.name')
                ->orderBy('loans_count', 'desc')
                ->limit(5)
                ->get();

            // Emprunts récents
            $recentLoans = DB::table('loans')
                ->join('users', 'loans.user_id', '=', 'users.id')
                ->join('books', 'loans.book_id', '=', 'books.id')
                ->select('loans.loan_date', 'users.name as user_name', 'books.title as book_title')
                ->orderBy('loans.created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'stats' => [
                    'total_books' => $totalBooks,
                    'total_users' => $totalUsers,
                    'active_loans' => $activeLoans,
                    'overdue_loans' => $overdueLoans
                ],
                'popular_books' => $popularBooks,
                'recent_loans' => $recentLoans
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'stats' => [
                    'total_books' => 0,
                    'total_users' => 0,
                    'active_loans' => 0,
                    'overdue_loans' => 0
                ],
                'popular_books' => [],
                'recent_loans' => [],
                'error' => $e->getMessage()
            ]);
        }
    }
}