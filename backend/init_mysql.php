<?php

// Script pour initialiser MySQL avec les données de test
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'elibrary';

try {
    // Connexion sans spécifier de base de données pour la créer
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connexion à MySQL réussie.\n";
    
    // Créer la base de données
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Base de données '$database' créée.\n";
    
    // Se connecter à la base de données
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Créer les tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS books (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            isbn VARCHAR(255) NOT NULL UNIQUE,
            category_id BIGINT UNSIGNED NOT NULL,
            quantity INT NOT NULL,
            available_quantity INT NOT NULL,
            description TEXT,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS loans (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            book_id BIGINT UNSIGNED NOT NULL,
            loan_date TIMESTAMP NOT NULL,
            due_date TIMESTAMP NOT NULL,
            return_date TIMESTAMP NULL,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
        )
    ");
    
    echo "Tables créées avec succès.\n";
    
    // Insérer les catégories
    $categories = [
        [1, 'Fiction', 'Romans et nouvelles'],
        [2, 'Science-Fiction', 'Science-fiction et fantasy'],
        [3, 'Histoire', 'Livres d\'histoire'],
        [4, 'Philosophie', 'Ouvrages philosophiques'],
        [5, 'Informatique', 'Livres techniques'],
        [6, 'Romance', 'Romans d\'amour'],
        [7, 'Thriller', 'Suspense et thriller'],
        [8, 'Biographie', 'Biographies et autobiographies'],
        [9, 'Jeunesse', 'Livres pour enfants et adolescents'],
        [10, 'Essais', 'Essais et analyses']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), updated_at = NOW()");
    
    foreach ($categories as $category) {
        $stmt->execute($category);
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
    
    $stmt = $pdo->prepare("INSERT INTO books (title, author, isbn, category_id, quantity, available_quantity, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE title = VALUES(title), author = VALUES(author), category_id = VALUES(category_id), quantity = VALUES(quantity), available_quantity = VALUES(available_quantity), description = VALUES(description), updated_at = NOW()");
    
    foreach ($books as $book) {
        $stmt->execute($book);
    }
    
    echo "Livres insérés avec succès.\n";
    
    // Vérifier les données
    $result = $pdo->query("SELECT COUNT(*) as count FROM books");
    $count = $result->fetch(PDO::FETCH_ASSOC);
    echo "Nombre de livres dans la base : " . $count['count'] . "\n";
    
    $result = $pdo->query("SELECT COUNT(*) as count FROM categories");
    $count = $result->fetch(PDO::FETCH_ASSOC);
    echo "Nombre de catégories dans la base : " . $count['count'] . "\n";
    
    echo "\nBase de données MySQL initialisée avec succès !\n";
    echo "Vous pouvez maintenant démarrer le serveur Laravel.\n";
    
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
    echo "Assurez-vous que MySQL est démarré et que les credentials sont corrects.\n";
}