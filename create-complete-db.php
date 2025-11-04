<?php

// Supprimer l'ancienne base
if (file_exists('backend/database/database.sqlite')) {
    unlink('backend/database/database.sqlite');
}

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Créer les tables
$db->exec("
-- Table des utilisateurs avec rôles
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des livres
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category_id INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    available INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table des emprunts
CREATE TABLE borrows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    date_emprunt DATE NOT NULL,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'returned', 'overdue')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Table des notifications
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK(type IN ('info', 'warning', 'error')),
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
");

// Insérer les données de test
$db->exec("
-- Catégories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Romans, nouvelles et littérature'),
('Science', 'Livres scientifiques et techniques'),
('Histoire', 'Livres d''histoire et biographies'),
('Informatique', 'Programmation et technologies'),
('Philosophie', 'Philosophie et pensée'),
('Art', 'Beaux-arts et culture');

-- Utilisateurs (mot de passe: password)
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin Bibliothèque', 'admin@elibrary.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '0123456789'),
('Jean Dupont', 'jean@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0123456788'),
('Marie Martin', 'marie@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0123456787'),
('Pierre Durand', 'pierre@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '0123456786');

-- Livres
INSERT INTO books (title, author, isbn, category_id, stock, available, description) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-07-040850-1', 1, 3, 2, 'Un conte philosophique et poétique'),
('1984', 'George Orwell', '978-2-07-036822-5', 1, 2, 1, 'Roman dystopique sur la surveillance'),
('Introduction à l''Algorithmique', 'Thomas Cormen', '978-2-10-054526-1', 4, 2, 2, 'Manuel de référence en algorithmique'),
('Histoire de France', 'Jules Michelet', '978-2-07-011015-9', 3, 4, 3, 'Histoire complète de la France'),
('Méditations Métaphysiques', 'René Descartes', '978-2-08-070061-9', 5, 2, 2, 'Fondements de la philosophie moderne'),
('Clean Code', 'Robert Martin', '978-0-13-235088-4', 4, 3, 2, 'Guide pour écrire du code propre'),
('Sapiens', 'Yuval Noah Harari', '978-2-226-25701-7', 3, 5, 4, 'Une brève histoire de l''humanité'),
('L''Art de la Guerre', 'Sun Tzu', '978-2-253-06819-1', 5, 2, 2, 'Traité de stratégie militaire');

-- Emprunts de test
INSERT INTO borrows (user_id, book_id, date_emprunt, date_retour_prevue, date_retour_effective, status) VALUES
(2, 1, '2024-10-15', '2024-10-22', NULL, 'active'),
(3, 2, '2024-10-20', '2024-10-27', NULL, 'active'),
(4, 6, '2024-10-10', '2024-10-17', NULL, 'overdue'),
(2, 4, '2024-10-05', '2024-10-12', '2024-10-11', 'returned');

-- Notifications
INSERT INTO notifications (user_id, message, type) VALUES
(4, 'Votre livre \"Clean Code\" est en retard. Merci de le retourner rapidement.', 'warning'),
(2, 'Votre emprunt de \"Le Petit Prince\" expire dans 2 jours.', 'info');
");

echo "✅ Base de données eLibrary créée avec succès!\n";
echo "📚 6 catégories créées\n";
echo "👥 4 utilisateurs créés (1 admin, 3 users)\n";
echo "📖 8 livres ajoutés\n";
echo "📋 4 emprunts de test\n";
echo "🔔 2 notifications\n";
echo "\n🔑 Comptes de test:\n";
echo "Admin: admin@elibrary.com / password\n";
echo "User: jean@example.com / password\n";
echo "User: marie@example.com / password\n";
echo "User: pierre@example.com / password\n";
?>