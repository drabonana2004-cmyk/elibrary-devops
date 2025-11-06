<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Notification;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function approveLoan($id)
    {
        $loan = Loan::with('book')->find($id);
        $loan->update(['status' => 'approved']);
        
        Notification::create([
            'user_id' => $loan->user_id,
            'type' => 'loan_approved',
            'title' => 'Demande acceptée',
            'message' => "Votre demande pour \"{$loan->book->title}\" a été acceptée"
        ]);
        
        return response()->json(['success' => true]);
    }

    public function getActiveLoans()
    {
        $loans = Loan::with('book')
            ->where('status', 'approved')
            ->get();
        return response()->json($loans);
    }
}