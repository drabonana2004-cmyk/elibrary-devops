<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class PenaltyController extends Controller
{
    public function getOverdueLoans(): JsonResponse
    {
        $penaltyRate = Setting::where('key', 'penalty_rate')->value('value') ?? 300; // 300 CFA par défaut
        
        $overdueLoans = Loan::with(['user', 'book'])
            ->where('status', 'active')
            ->where('due_date', '<', Carbon::now())
            ->get()
            ->map(function ($loan) use ($penaltyRate) {
                $daysOverdue = Carbon::now()->diffInDays($loan->due_date);
                $penalty = $daysOverdue * $penaltyRate;
                
                return [
                    'id' => $loan->id,
                    'user_name' => $loan->user->name,
                    'book_title' => $loan->book->title,
                    'due_date' => $loan->due_date->format('M d, Y'),
                    'days_overdue' => $daysOverdue,
                    'penalty_amount' => $penalty,
                    'penalty_formatted' => number_format($penalty) . ' CFA'
                ];
            });

        return response()->json($overdueLoans);
    }
}