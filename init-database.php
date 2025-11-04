<?php

// Créer le fichier SQLite vide
if (!file_exists('backend/database/database.sqlite')) {
    touch('backend/database/database.sqlite');
}

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Créer les tables
$db->exec("
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
");

// Insérer des données de test
$db->exec("
INSERT OR IGNORE INTO categories (name, description) VALUES
('Fiction', 'Romans et nouvelles'),
('Science', 'Livres scientifiques'),
('Histoire', 'Livres d''histoire'),
('Informatique', 'Livres de programmation');

INSERT OR IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@elibrary.com', 'password', 'librarian'),
('Jean Dupont', 'jean@example.com', 'password', 'student'),
('Marie Martin', 'marie@example.com', 'password', 'student');

INSERT OR IGNORE INTO books (title, author, isbn, category_id, quantity, available_quantity, description) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-07-040850-1', 1, 5, 5, 'Un conte philosophique'),
('1984', 'George Orwell', '978-2-07-036822-5', 1, 3, 2, 'Roman dystopique'),
('Algorithmique', 'Thomas Cormen', '978-2-10-054526-1', 4, 2, 2, 'Manuel d''algorithmique'),
('Histoire de France', 'Jules Michelet', '978-2-07-011015-9', 3, 4, 4, 'Histoire de France');
");

echo "Base de données SQLite créée avec succès!\n";
echo "Tables créées et données de test ajoutées.\n";
?>