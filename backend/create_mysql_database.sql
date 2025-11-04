-- Script pour créer la base de données MySQL et insérer les données de test

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elibrary;

-- Créer la table categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- Créer la table books
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
);

-- Créer la table loans
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
);

-- Insérer les catégories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Fiction', 'Romans et nouvelles', NOW(), NOW()),
(2, 'Science-Fiction', 'Science-fiction et fantasy', NOW(), NOW()),
(3, 'Histoire', 'Livres d\'histoire', NOW(), NOW()),
(4, 'Philosophie', 'Ouvrages philosophiques', NOW(), NOW()),
(5, 'Informatique', 'Livres techniques', NOW(), NOW()),
(6, 'Romance', 'Romans d\'amour', NOW(), NOW()),
(7, 'Thriller', 'Suspense et thriller', NOW(), NOW()),
(8, 'Biographie', 'Biographies et autobiographies', NOW(), NOW()),
(9, 'Jeunesse', 'Livres pour enfants et adolescents', NOW(), NOW()),
(10, 'Essais', 'Essais et analyses', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    description = VALUES(description),
    updated_at = NOW();

-- Insérer les livres de test
INSERT INTO books (title, author, isbn, category_id, quantity, available_quantity, description, created_at, updated_at) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070408504', 1, 5, 5, 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.', NOW(), NOW()),
('Dune', 'Frank Herbert', '9782266320580', 2, 3, 3, 'Une épopée de science-fiction dans un univers désertique lointain.', NOW(), NOW()),
('L\'Histoire de France', 'Ernest Lavisse', '9782253906827', 3, 4, 4, 'Une histoire complète de la France des origines à nos jours.', NOW(), NOW()),
('Méditations métaphysiques', 'René Descartes', '9782080706270', 4, 2, 2, 'Les fondements de la philosophie moderne par Descartes.', NOW(), NOW()),
('Clean Code', 'Robert C. Martin', '9780132350884', 5, 6, 6, 'Guide pour écrire du code propre et maintenable.', NOW(), NOW()),
('Orgueil et Préjugés', 'Jane Austen', '9782253004226', 6, 4, 4, 'Un classique de la littérature romantique anglaise.', NOW(), NOW()),
('Da Vinci Code', 'Dan Brown', '9782253121251', 7, 5, 5, 'Un thriller captivant mêlant art, histoire et mystère.', NOW(), NOW()),
('Steve Jobs', 'Walter Isaacson', '9782709638326', 8, 3, 3, 'La biographie officielle du fondateur d\'Apple.', NOW(), NOW()),
('Harry Potter à l\'école des sorciers', 'J.K. Rowling', '9782070541270', 9, 8, 8, 'Le premier tome de la saga du jeune sorcier.', NOW(), NOW()),
('Sapiens', 'Yuval Noah Harari', '9782226257017', 10, 4, 4, 'Une brève histoire de l\'humanité.', NOW(), NOW()),
('1984', 'George Orwell', '9782070368228', 1, 6, 6, 'Un roman dystopique sur la surveillance et le totalitarisme.', NOW(), NOW()),
('Fondation', 'Isaac Asimov', '9782070360260', 2, 3, 3, 'Le premier tome du cycle de Fondation.', NOW(), NOW()),
('Les Misérables', 'Victor Hugo', '9782253096337', 1, 4, 4, 'Le chef-d\'œuvre de Victor Hugo sur la France du XIXe siècle.', NOW(), NOW()),
('Algorithmes', 'Thomas H. Cormen', '9782100545261', 5, 2, 2, 'Introduction aux algorithmes et structures de données.', NOW(), NOW()),
('Gone Girl', 'Gillian Flynn', '9782253183457', 7, 3, 3, 'Un thriller psychologique sur un couple en crise.', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    author = VALUES(author),
    category_id = VALUES(category_id),
    quantity = VALUES(quantity),
    available_quantity = VALUES(available_quantity),
    description = VALUES(description),
    updated_at = NOW();