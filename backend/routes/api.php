<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LoanController;

Route::middleware('auth:sanctum')->group(function () {
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    
    // Emprunts
    Route::get('/loans/active', [LoanController::class, 'getActiveLoans']);
    Route::put('/loans/{id}/return', [LoanController::class, 'returnBook']);
    Route::post('/loans/{id}/approve', [LoanController::class, 'approveLoan']);
});