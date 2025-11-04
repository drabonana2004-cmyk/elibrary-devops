<?php
echo "Remise a zero complete de la base de donnees...\n";

$host = '127.0.0.1';
$dbname = 'elibrary';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Suppression de toutes les donnees...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DELETE FROM loans");
    $pdo->exec("DELETE FROM books");
    $pdo->exec("DELETE FROM categories");
    $pdo->exec("DELETE FROM users");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "Reset des compteurs auto-increment...\n";
    $pdo->exec("ALTER TABLE loans AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE books AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE categories AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE users AUTO_INCREMENT = 1");
    
    // Vérification
    $totalBooks = $pdo->query("SELECT COUNT(*) FROM books")->fetchColumn();
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalLoans = $pdo->query("SELECT COUNT(*) FROM loans")->fetchColumn();
    $totalCategories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    
    echo "\n=== BASE DE DONNEES REMISE A ZERO ===\n";
    echo "Livres: $totalBooks\n";
    echo "Utilisateurs: $totalUsers\n";
    echo "Emprunts: $totalLoans\n";
    echo "Categories: $totalCategories\n";
    echo "\nLa base est maintenant vide!\n";
    
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
?>