<?php
echo "Correction des donnees du dashboard...\n";

// Configuration base de données
$host = '127.0.0.1';
$dbname = 'elibrary';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Vider et réinsérer les données
    echo "Suppression des anciennes donnees...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DELETE FROM loans");
    $pdo->exec("DELETE FROM books");
    $pdo->exec("DELETE FROM categories");
    $pdo->exec("DELETE FROM users");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "Insertion des nouvelles donnees...\n";
    
    // Catégories
    $pdo->exec("INSERT INTO categories (id, name, description, created_at, updated_at) VALUES 
        (1, 'Informatique', 'Livres de programmation et technologie', NOW(), NOW()),
        (2, 'Sciences', 'Livres scientifiques et mathematiques', NOW(), NOW()),
        (3, 'Litterature', 'Romans et oeuvres litteraires', NOW(), NOW())");
    
    // Utilisateurs
    $pdo->exec("INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES 
        (1, 'Marie Dupont', 'marie.dupont@email.com', 'student', NOW(), NOW()),
        (2, 'Jean Martin', 'jean.martin@email.com', 'student', NOW(), NOW()),
        (3, 'Sophie Bernard', 'sophie.bernard@email.com', 'student', NOW(), NOW()),
        (4, 'Admin Biblio', 'admin@elibrary.com', 'librarian', NOW(), NOW())");
    
    // Livres
    $pdo->exec("INSERT INTO books (id, title, author, isbn, category_id, quantity, available_quantity, created_at, updated_at) VALUES 
        (1, 'Laravel pour les debutants', 'John Doe', '978-2-1234-5678-9', 1, 5, 3, NOW(), NOW()),
        (2, 'Angular Avance', 'Jane Smith', '978-2-1234-5679-6', 1, 3, 1, NOW(), NOW()),
        (3, 'Vue.js Essentials', 'Bob Wilson', '978-2-1234-5680-2', 1, 4, 2, NOW(), NOW()),
        (4, 'React Handbook', 'Alice Brown', '978-2-1234-5681-9', 1, 6, 4, NOW(), NOW()),
        (5, 'Physique Quantique', 'Dr. Einstein', '978-2-1234-5682-6', 2, 2, 2, NOW(), NOW()),
        (6, 'Le Petit Prince', 'Antoine de Saint-Exupery', '978-2-1234-5683-3', 3, 8, 7, NOW(), NOW())");
    
    // Emprunts
    $pdo->exec("INSERT INTO loans (id, user_id, book_id, loan_date, due_date, return_date, status, created_at, updated_at) VALUES 
        (1, 1, 1, '2024-10-15', '2024-11-15', NULL, 'active', NOW(), NOW()),
        (2, 2, 2, '2024-10-20', '2024-11-20', NULL, 'active', NOW(), NOW()),
        (3, 3, 3, '2024-10-25', '2024-11-25', NULL, 'active', NOW(), NOW()),
        (4, 1, 4, '2024-09-01', '2024-10-01', '2024-09-28', 'returned', NOW(), NOW())");
    
    // Vérifier les données
    $totalBooks = $pdo->query("SELECT COUNT(*) FROM books")->fetchColumn();
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
    $activeLoans = $pdo->query("SELECT COUNT(*) FROM loans WHERE status = 'active'")->fetchColumn();
    
    echo "\n=== VERIFICATION ===\n";
    echo "Livres total: $totalBooks\n";
    echo "Utilisateurs: $totalUsers\n";
    echo "Emprunts actifs: $activeLoans\n";
    echo "\nDonnees inserees avec succes!\n";
    echo "Le dashboard devrait maintenant afficher les vraies donnees.\n";
    
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
    echo "\nVerifiez que:\n";
    echo "1. MySQL est demarre\n";
    echo "2. La base 'elibrary' existe\n";
    echo "3. Les identifiants sont corrects\n";
}
?>