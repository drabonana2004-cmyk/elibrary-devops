-- Création de la base de données eLibrary
CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE elibrary;

-- Table des catégories
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'librarian') DEFAULT 'student',
    phone VARCHAR(255),
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- Table des livres
CREATE TABLE books (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) UNIQUE NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table des emprunts
CREATE TABLE loans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    book_id BIGINT UNSIGNED NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Données de test
INSERT INTO categories (name, description) VALUES
('Fiction', 'Romans et nouvelles'),
('Science', 'Livres scientifiques'),
('Histoire', 'Livres d\'histoire'),
('Informatique', 'Livres de programmation et technologie');

INSERT INTO users (name, email, password, role) VALUES
('Admin Bibliothèque', 'admin@elibrary.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'librarian'),
('Jean Dupont', 'jean@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Marie Martin', 'marie@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

INSERT INTO books (title, author, isbn, category_id, quantity, available_quantity, description) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-07-040850-1', 1, 5, 5, 'Un conte philosophique'),
('1984', 'George Orwell', '978-2-07-036822-5', 1, 3, 2, 'Roman dystopique'),
('Introduction à l\'Algorithmique', 'Thomas Cormen', '978-2-10-054526-1', 4, 2, 2, 'Manuel d\'algorithmique'),
('Histoire de France', 'Jules Michelet', '978-2-07-011015-9', 3, 4, 4, 'Histoire complète de la France');