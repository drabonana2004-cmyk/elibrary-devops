<?php

// API simple pour eLibrary avec données en mémoire
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Données en mémoire pour les tests
$categories = [
    ['id' => 1, 'name' => 'Fiction', 'description' => 'Romans et nouvelles'],
    ['id' => 2, 'name' => 'Science-Fiction', 'description' => 'Science-fiction et fantasy'],
    ['id' => 3, 'name' => 'Histoire', 'description' => 'Livres d\'histoire'],
    ['id' => 4, 'name' => 'Philosophie', 'description' => 'Ouvrages philosophiques'],
    ['id' => 5, 'name' => 'Informatique', 'description' => 'Livres techniques'],
    ['id' => 6, 'name' => 'Romance', 'description' => 'Romans d\'amour'],
    ['id' => 7, 'name' => 'Thriller', 'description' => 'Suspense et thriller'],
    ['id' => 8, 'name' => 'Biographie', 'description' => 'Biographies et autobiographies'],
    ['id' => 9, 'name' => 'Jeunesse', 'description' => 'Livres pour enfants et adolescents'],
    ['id' => 10, 'name' => 'Essais', 'description' => 'Essais et analyses']
];

$books = [
    ['id' => 1, 'title' => 'Le Petit Prince', 'author' => 'Antoine de Saint-Exupéry', 'isbn' => '9782070408504', 'category_id' => 1, 'quantity' => 5, 'available_quantity' => 5, 'description' => 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.'],
    ['id' => 2, 'title' => 'Dune', 'author' => 'Frank Herbert', 'isbn' => '9782266320580', 'category_id' => 2, 'quantity' => 3, 'available_quantity' => 3, 'description' => 'Une épopée de science-fiction dans un univers désertique lointain.'],
    ['id' => 3, 'title' => 'L\'Histoire de France', 'author' => 'Ernest Lavisse', 'isbn' => '9782253906827', 'category_id' => 3, 'quantity' => 4, 'available_quantity' => 4, 'description' => 'Une histoire complète de la France des origines à nos jours.'],
    ['id' => 4, 'title' => 'Méditations métaphysiques', 'author' => 'René Descartes', 'isbn' => '9782080706270', 'category_id' => 4, 'quantity' => 2, 'available_quantity' => 2, 'description' => 'Les fondements de la philosophie moderne par Descartes.'],
    ['id' => 5, 'title' => 'Clean Code', 'author' => 'Robert C. Martin', 'isbn' => '9780132350884', 'category_id' => 5, 'quantity' => 6, 'available_quantity' => 6, 'description' => 'Guide pour écrire du code propre et maintenable.'],
    ['id' => 6, 'title' => 'Orgueil et Préjugés', 'author' => 'Jane Austen', 'isbn' => '9782253004226', 'category_id' => 6, 'quantity' => 4, 'available_quantity' => 4, 'description' => 'Un classique de la littérature romantique anglaise.'],
    ['id' => 7, 'title' => 'Da Vinci Code', 'author' => 'Dan Brown', 'isbn' => '9782253121251', 'category_id' => 7, 'quantity' => 5, 'available_quantity' => 5, 'description' => 'Un thriller captivant mêlant art, histoire et mystère.'],
    ['id' => 8, 'title' => 'Steve Jobs', 'author' => 'Walter Isaacson', 'isbn' => '9782709638326', 'category_id' => 8, 'quantity' => 3, 'available_quantity' => 3, 'description' => 'La biographie officielle du fondateur d\'Apple.'],
    ['id' => 9, 'title' => 'Harry Potter à l\'école des sorciers', 'author' => 'J.K. Rowling', 'isbn' => '9782070541270', 'category_id' => 9, 'quantity' => 8, 'available_quantity' => 8, 'description' => 'Le premier tome de la saga du jeune sorcier.'],
    ['id' => 10, 'title' => 'Sapiens', 'author' => 'Yuval Noah Harari', 'isbn' => '9782226257017', 'category_id' => 10, 'quantity' => 4, 'available_quantity' => 4, 'description' => 'Une brève histoire de l\'humanité.'],
    ['id' => 11, 'title' => '1984', 'author' => 'George Orwell', 'isbn' => '9782070368228', 'category_id' => 1, 'quantity' => 6, 'available_quantity' => 6, 'description' => 'Un roman dystopique sur la surveillance et le totalitarisme.'],
    ['id' => 12, 'title' => 'Fondation', 'author' => 'Isaac Asimov', 'isbn' => '9782070360260', 'category_id' => 2, 'quantity' => 3, 'available_quantity' => 3, 'description' => 'Le premier tome du cycle de Fondation.'],
    ['id' => 13, 'title' => 'Les Misérables', 'author' => 'Victor Hugo', 'isbn' => '9782253096337', 'category_id' => 1, 'quantity' => 4, 'available_quantity' => 4, 'description' => 'Le chef-d\'œuvre de Victor Hugo sur la France du XIXe siècle.'],
    ['id' => 14, 'title' => 'Algorithmes', 'author' => 'Thomas H. Cormen', 'isbn' => '9782100545261', 'category_id' => 5, 'quantity' => 2, 'available_quantity' => 2, 'description' => 'Introduction aux algorithmes et structures de données.'],
    ['id' => 15, 'title' => 'Gone Girl', 'author' => 'Gillian Flynn', 'isbn' => '9782253183457', 'category_id' => 7, 'quantity' => 3, 'available_quantity' => 3, 'description' => 'Un thriller psychologique sur un couple en crise.']
];

// Fichier pour stocker les emprunts et les quantités mises à jour
$dataFile = __DIR__ . '/api_data.json';
$apiData = ['books' => $books, 'loans' => []];

if (file_exists($dataFile)) {
    $stored = json_decode(file_get_contents($dataFile), true);
    if ($stored) {
        $apiData = $stored;
        $books = $apiData['books'];
    }
}

$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Route pour obtenir les livres
if ($method === 'GET' && strpos($requestUri, '/api/books') !== false) {
    $formattedBooks = array_map(function($book) use ($categories) {
        $category = array_filter($categories, function($cat) use ($book) {
            return $cat['id'] == $book['category_id'];
        });
        $category = reset($category);
        
        return [
            'id' => $book['id'],
            'title' => $book['title'],
            'author' => $book['author'],
            'isbn' => $book['isbn'],
            'category_id' => $book['category_id'],
            'quantity' => $book['quantity'],
            'available_quantity' => $book['available_quantity'],
            'description' => $book['description'],
            'category' => [
                'id' => $book['category_id'],
                'name' => $category['name'] ?? 'Fiction'
            ]
        ];
    }, $books);
    
    echo json_encode(['data' => $formattedBooks]);
    exit;
}

// Route pour demander un emprunt
if ($method === 'POST' && strpos($requestUri, '/api/request-borrow') !== false) {
    error_log('Demande d\'emprunt reçue');
    
    $input = json_decode(file_get_contents('php://input'), true);
    error_log('Données reçues: ' . json_encode($input));
    
    $bookId = $input['book_id'] ?? null;
    
    if (!$bookId) {
        error_log('ID du livre manquant');
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID du livre requis']);
        exit;
    }
    
    // Trouver le livre
    $bookIndex = -1;
    foreach ($books as $index => $book) {
        if ($book['id'] == $bookId) {
            $bookIndex = $index;
            break;
        }
    }
    
    if ($bookIndex === -1) {
        error_log('Livre non trouvé: ' . $bookId);
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Livre non trouvé']);
        exit;
    }
    
    if ($books[$bookIndex]['available_quantity'] <= 0) {
        error_log('Livre non disponible: ' . $bookId);
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ce livre n\'est pas disponible']);
        exit;
    }
    
    // Créer l'emprunt
    $loanId = count($apiData['loans']) + 1;
    $loan = [
        'id' => $loanId,
        'user_id' => 1,
        'book_id' => $bookId,
        'loan_date' => date('Y-m-d H:i:s'),
        'due_date' => date('Y-m-d H:i:s', strtotime('+14 days')),
        'return_date' => null,
        'status' => 'active'
    ];
    
    $apiData['loans'][] = $loan;
    
    // Décrémenter la quantité disponible
    $books[$bookIndex]['available_quantity']--;
    $apiData['books'] = $books;
    
    // Sauvegarder les données
    $saved = file_put_contents($dataFile, json_encode($apiData, JSON_PRETTY_PRINT));
    error_log('Données sauvegardées: ' . ($saved ? 'oui' : 'non'));
    
    echo json_encode([
        'success' => true, 
        'message' => 'Emprunt créé avec succès',
        'loan_id' => $loanId,
        'book_title' => $books[$bookIndex]['title']
    ]);
    exit;
}

// Route pour obtenir mes emprunts
if ($method === 'GET' && strpos($requestUri, '/api/my-borrows') !== false) {
    $formattedLoans = array_map(function($loan) use ($books) {
        $book = array_filter($books, function($b) use ($loan) {
            return $b['id'] == $loan['book_id'];
        });
        $book = reset($book);
        
        return [
            'id' => $loan['id'],
            'title' => $book['title'] ?? 'Livre inconnu',
            'author' => $book['author'] ?? 'Auteur inconnu',
            'date_emprunt' => $loan['loan_date'],
            'date_retour_prevue' => $loan['due_date'],
            'date_retour_effective' => $loan['return_date'],
            'status' => $loan['status']
        ];
    }, $apiData['loans']);
    
    echo json_encode($formattedLoans);
    exit;
}

// Route pour les notifications
if ($method === 'GET' && strpos($requestUri, '/api/notifications') !== false) {
    echo json_encode([]);
    exit;
}

// Route par défaut
http_response_code(404);
echo json_encode(['error' => 'Route non trouvée']);