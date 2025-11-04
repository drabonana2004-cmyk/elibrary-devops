<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generatePDF(string $type): Response
    {
        $data = $this->getReportData($type);
        $html = $this->generateHTML($type, $data);
        
        // Simuler la génération PDF (vous pouvez utiliser DomPDF ou TCPDF)
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="rapport_' . $type . '_' . date('Y-m-d') . '.pdf"'
        ];
        
        return response($html, 200, $headers);
    }
    
    public function getStats(): JsonResponse
    {
        $stats = [
            'books_by_category' => Book::selectRaw('categories.name, COUNT(*) as count')
                ->join('categories', 'books.category_id', '=', 'categories.id')
                ->groupBy('categories.name')
                ->get(),
            'loans_by_month' => Loan::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->get(),
            'popular_books' => Book::withCount('loans')
                ->orderBy('loans_count', 'desc')
                ->limit(10)
                ->get(),
            'user_activity' => User::withCount('loans')
                ->where('role', 'student')
                ->orderBy('loans_count', 'desc')
                ->limit(10)
                ->get()
        ];
        
        return response()->json($stats);
    }
    
    private function getReportData(string $type): array
    {
        switch ($type) {
            case 'books':
                return [
                    'title' => 'Rapport des Livres',
                    'data' => Book::with('category')->get()
                ];
            case 'loans':
                return [
                    'title' => 'Rapport des Emprunts',
                    'data' => Loan::with(['user', 'book'])->get()
                ];
            case 'users':
                return [
                    'title' => 'Rapport des Utilisateurs',
                    'data' => User::withCount('loans')->get()
                ];
            default:
                return ['title' => 'Rapport Général', 'data' => []];
        }
    }
    
    private function generateHTML(string $type, array $data): string
    {
        $logoPath = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>{$data['title']}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { width: 80px; height: 80px; margin: 0 auto 10px; }
                .title { color: #007bff; font-size: 24px; font-weight: bold; }
                .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
                .date { color: #999; font-size: 12px; margin-top: 10px; }
                .content { margin: 20px 0; }
                .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f8f9fa; }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='logo'>📚</div>
                <div class='title'>eLibrary - Système de Gestion</div>
                <div class='subtitle'>{$data['title']}</div>
                <div class='date'>Généré le " . date('d/m/Y à H:i') . "</div>
            </div>
            
            <div class='content'>
                <p>Ce rapport présente un aperçu détaillé des données de notre système de gestion de bibliothèque eLibrary. 
                Les informations ci-dessous reflètent l'état actuel de notre collection et des activités de nos utilisateurs.</p>
                
                " . $this->generateTableContent($type, $data['data']) . "
            </div>
            
            <div class='footer'>
                <p>eLibrary - Système de Gestion de Bibliothèque</p>
                <p>Rapport généré automatiquement - Confidentiel</p>
            </div>
        </body>
        </html>";
    }
    
    private function generateTableContent(string $type, $data): string
    {
        if (empty($data)) return '<p>Aucune donnée disponible.</p>';
        
        switch ($type) {
            case 'books':
                $html = '<table><tr><th>Titre</th><th>Auteur</th><th>ISBN</th><th>Catégorie</th><th>Stock</th></tr>';
                foreach ($data as $item) {
                    $html .= "<tr><td>{$item->title}</td><td>{$item->author}</td><td>{$item->isbn}</td><td>{$item->category->name}</td><td>{$item->quantity}</td></tr>";
                }
                return $html . '</table>';
                
            case 'loans':
                $html = '<table><tr><th>Utilisateur</th><th>Livre</th><th>Date Emprunt</th><th>Date Retour</th><th>Statut</th></tr>';
                foreach ($data as $item) {
                    $html .= "<tr><td>{$item->user->name}</td><td>{$item->book->title}</td><td>{$item->loan_date}</td><td>{$item->due_date}</td><td>{$item->status}</td></tr>";
                }
                return $html . '</table>';
                
            default:
                return '<p>Type de rapport non supporté.</p>';
        }
    }
}