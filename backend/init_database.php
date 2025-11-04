<?php

// Script pour initialiser la base de données avec des livres de test
$dbPath = __DIR__ . '/database/database.sqlite';

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connexion à la base de données réussie.\n";
    
    // Créer les tables si elles n'existent pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at DATETIME,
            updated_at DATETIME
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            isbn VARCHAR(255) UNIQUE NOT NULL,
            category_id INTEGER,
            quantity INTEGER NOT NULL,
            available_quantity INTEGER NOT NULL,
            description TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS loans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            loan_date DATETIME NOT NULL,
            due_date DATETIME NOT NULL,
            return_date DATETIME,
            status VARCHAR(50) DEFAULT 'active',
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (book_id) REFERENCES books(id)
        )
    ");
    
    echo "Tables créées avec succès.\n";
    
    // Insérer les catégories
    $categories = [
        ['Fiction', 'Romans et nouvelles'],
        ['Science-Fiction', 'Science-fiction et fantasy'],
        ['Histoire', 'Livres d\'histoire'],
        ['Philosophie', 'Ouvrages philosophiques'],
        ['Informatique', 'Livres techniques'],
        ['Romance', 'Romans d\'amour'],
        ['Thriller', 'Suspense et thriller'],
        ['Biographie', 'Biographies et autobiographies'],
        ['Jeunesse', 'Livres pour enfants et adolescents'],
        ['Essais', 'Essais et analyses']
    ];
    
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO categories (id, name, description, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))");
    
    foreach ($categories as $index => $category) {
        $stmt->execute([$index + 1, $category[0], $category[1]]);
    }
    
    echo "Catégories insérées avec succès.\n";
    
    // Insérer les livres de test
    $books = [
        ['Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070408504', 1, 5, 5, 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.'],
        ['Dune', 'Frank Herbert', '9782266320580', 2, 3, 3, 'Une épopée de science-fiction dans un univers désertique lointain.'],
        ['L\'Histoire de France', 'Ernest Lavisse', '9782253906827', 3, 4, 4, 'Une histoire complète de la France des origines à nos jours.'],
        ['Méditations métaphysiques', 'René Descartes', '9782080706270', 4, 2, 2, 'Les fondements de la philosophie moderne par Descartes.'],
        ['Clean Code', 'Robert C. Martin', '9780132350884', 5, 6, 6, 'Guide pour écrire du code propre et maintenable.'],
        ['Orgueil et Préjugés', 'Jane Austen', '9782253004226', 6, 4, 4, 'Un classique de la littérature romantique anglaise.'],
        ['Da Vinci Code', 'Dan Brown', '9782253121251', 7, 5, 5, 'Un thriller captivant mêlant art, histoire et mystère.'],
        ['Steve Jobs', 'Walter Isaacson', '9782709638326', 8, 3, 3, 'La biographie officielle du fondateur d\'Apple.'],
        ['Harry Potter à l\'école des sorciers', 'J.K. Rowling', '9782070541270', 9, 8, 8, 'Le premier tome de la saga du jeune sorcier.'],
        ['Sapiens', 'Yuval Noah Harari', '9782226257017', 10, 4, 4, 'Une brève histoire de l\'humanité.'],
        ['1984', 'George Orwell', '9782070368228', 1, 6, 6, 'Un roman dystopique sur la surveillance et le totalitarisme.'],
        ['Fondation', 'Isaac Asimov', '9782070360260', 2, 3, 3, 'Le premier tome du cycle de Fondation.'],
        ['Les Misérables', 'Victor Hugo', '9782253096337', 1, 4, 4, 'Le chef-d\'œuvre de Victor Hugo sur la France du XIXe siècle.'],
        ['Algorithmes', 'Thomas H. Cormen', '9782100545261', 5, 2, 2, 'Introduction aux algorithmes et structures de données.'],
        ['Gone Girl', 'Gillian Flynn', '9782253183457', 7, 3, 3, 'Un thriller psychologique sur un couple en crise.']
    ];
    
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO books (title, author, isbn, category_id, quantity, available_quantity, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))");
    
    foreach ($books as $book) {
        $stmt->execute($book);
    }
    
    echo "Livres insérés avec succès.\n";
    echo "Base de données initialisée avec " . count($books) . " livres de test.\n";
    
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
}