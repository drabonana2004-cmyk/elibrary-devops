<?php

$host = '127.0.0.1';
$dbname = 'elibrary';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Vider les tables
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("TRUNCATE TABLE loans");
    $pdo->exec("TRUNCATE TABLE books");
    $pdo->exec("TRUNCATE TABLE categories");
    $pdo->exec("TRUNCATE TABLE users");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    // Insérer des catégories
    $categories = [
        ['Informatique', 'Livres sur la programmation et les technologies'],
        ['Sciences', 'Livres scientifiques et mathématiques'],
        ['Littérature', 'Romans et œuvres littéraires'],
        ['Histoire', 'Livres d\'histoire et biographies'],
        ['Économie', 'Livres sur l\'économie et la gestion']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())");
    foreach ($categories as $category) {
        $stmt->execute($category);
    }
    
    // Insérer des utilisateurs
    $users = [
        ['Marie Dupont', 'marie.dupont@email.com', 'student'],
        ['Jean Martin', 'jean.martin@email.com', 'student'],
        ['Sophie Bernard', 'sophie.bernard@email.com', 'student'],
        ['Pierre Durand', 'pierre.durand@email.com', 'student'],
        ['Admin Biblio', 'admin@elibrary.com', 'librarian']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
    foreach ($users as $user) {
        $stmt->execute($user);
    }
    
    // Insérer des livres
    $books = [
        ['Laravel pour les débutants', 'John Doe', '978-2-1234-5678-9', 1, 5, 3],
        ['Angular Avancé', 'Jane Smith', '978-2-1234-5679-6', 1, 3, 1],
        ['Vue.js Essentials', 'Bob Wilson', '978-2-1234-5680-2', 1, 4, 2],
        ['React Handbook', 'Alice Brown', '978-2-1234-5681-9', 1, 6, 4],
        ['Physique Quantique', 'Dr. Einstein', '978-2-1234-5682-6', 2, 2, 2],
        ['Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-1234-5683-3', 3, 8, 7],
        ['Histoire de France', 'Michel Historian', '978-2-1234-5684-0', 4, 3, 2],
        ['Économie Moderne', 'Paul Economist', '978-2-1234-5685-7', 5, 4, 3]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, category_id, quantity, available_quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");
    foreach ($books as $book) {
        $stmt->execute($book);
    }
    
    // Insérer des emprunts
    $loans = [
        [1, 1, '2024-10-15', '2024-11-15', null, 'active'],
        [2, 2, '2024-10-20', '2024-11-20', null, 'active'],
        [3, 3, '2024-10-25', '2024-11-25', null, 'active'],
        [1, 4, '2024-09-01', '2024-10-01', '2024-09-28', 'returned'],
        [2, 1, '2024-08-15', '2024-09-15', null, 'active'], // En retard
    ];
    
    $stmt = $pdo->prepare("INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");
    foreach ($loans as $loan) {
        $stmt->execute($loan);
    }
    
    echo "Base de données réinitialisée avec succès!\n";
    
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
?>