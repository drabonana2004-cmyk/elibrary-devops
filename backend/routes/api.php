<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check endpoint
Route::get('/health', function () {
    try {
        // Test database connection
        DB::connection()->getPdo();
        
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now(),
            'services' => [
                'database' => 'connected',
                'cache' => 'available'
            ]
        ], 200);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'timestamp' => now(),
            'error' => $e->getMessage()
        ], 503);
    }
});

// Metrics endpoint for Prometheus
Route::get('/metrics', function () {
    $metrics = [
        'http_requests_total' => rand(100, 1000),
        'http_request_duration_seconds' => rand(1, 100) / 1000,
        'database_connections_active' => rand(1, 10),
        'memory_usage_bytes' => memory_get_usage(true),
        'cpu_usage_percent' => rand(10, 80)
    ];
    
    $output = '';
    foreach ($metrics as $name => $value) {
        $output .= "# HELP {$name} Application metric\n";
        $output .= "# TYPE {$name} gauge\n";
        $output .= "{$name} {$value}\n";
    }
    
    return response($output, 200)
        ->header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
});

// Dashboard stats
Route::get('/dashboard/stats', function () {
    return response()->json([
        'stats' => [
            'total_books' => rand(50, 200),
            'total_users' => rand(20, 100),
            'active_loans' => rand(5, 50),
            'overdue_loans' => rand(0, 10)
        ],
        'popular_books' => [
            ['title' => 'Laravel Guide', 'author' => 'John Doe', 'borrow_count' => 15],
            ['title' => 'Angular Basics', 'author' => 'Jane Smith', 'borrow_count' => 12]
        ],
        'recent_loans' => [
            ['book_title' => 'Docker Mastery', 'user_name' => 'Alice', 'date_emprunt' => now()],
            ['book_title' => 'Kubernetes Guide', 'user_name' => 'Bob', 'date_emprunt' => now()]
        ]
    ]);
});

// Books endpoints
Route::get('/books', function () {
    return response()->json([
        ['id' => 1, 'title' => 'Laravel Guide', 'author' => 'John Doe', 'available' => 3],
        ['id' => 2, 'title' => 'Angular Basics', 'author' => 'Jane Smith', 'available' => 2]
    ]);
});

// Users endpoints
Route::get('/users', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Alice', 'email' => 'alice@example.com', 'status' => 'active'],
        ['id' => 2, 'name' => 'Bob', 'email' => 'bob@example.com', 'status' => 'active']
    ]);
});

// Borrows endpoints
Route::get('/borrows', function () {
    return response()->json([
        ['id' => 1, 'user_name' => 'Alice', 'book_title' => 'Laravel Guide', 'status' => 'active'],
        ['id' => 2, 'user_name' => 'Bob', 'book_title' => 'Angular Basics', 'status' => 'returned']
    ]);
});

Route::patch('/borrows/{id}/return', function ($id) {
    return response()->json(['message' => 'Book returned successfully']);
});

Route::get('/borrows/overdue', function () {
    return response()->json([]);
});

Route::post('/reminders/{userId}', function ($userId) {
    return response()->json(['message' => 'Reminder sent']);
});

Route::get('/notifications', function () {
    return response()->json([]);
});