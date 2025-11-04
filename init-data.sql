-- Réinitialisation de la base de données eLibrary

USE elibrary;

-- Vider les tables
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM loans;
DELETE FROM books;
DELETE FROM categories;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insérer les catégories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES 
(1, 'Informatique', 'Livres de programmation et technologie', NOW(), NOW()),
(2, 'Sciences', 'Livres scientifiques et mathématiques', NOW(), NOW()),
(3, 'Littérature', 'Romans et œuvres littéraires', NOW(), NOW()),
(4, 'Histoire', 'Livres d\'histoire et biographies', NOW(), NOW()),
(5, 'Économie', 'Livres d\'économie et gestion', NOW(), NOW());

-- Insérer les utilisateurs
INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES 
(1, 'Marie Dupont', 'marie.dupont@email.com', 'student', NOW(), NOW()),
(2, 'Jean Martin', 'jean.martin@email.com', 'student', NOW(), NOW()),
(3, 'Sophie Bernard', 'sophie.bernard@email.com', 'student', NOW(), NOW()),
(4, 'Pierre Durand', 'pierre.durand@email.com', 'student', NOW(), NOW()),
(5, 'Admin Biblio', 'admin@elibrary.com', 'librarian', NOW(), NOW());

-- Insérer les livres
INSERT INTO books (id, title, author, isbn, category_id, quantity, available_quantity, created_at, updated_at) VALUES 
(1, 'Laravel pour les débutants', 'John Doe', '978-2-1234-5678-9', 1, 5, 3, NOW(), NOW()),
(2, 'Angular Avancé', 'Jane Smith', '978-2-1234-5679-6', 1, 3, 1, NOW(), NOW()),
(3, 'Vue.js Essentials', 'Bob Wilson', '978-2-1234-5680-2', 1, 4, 2, NOW(), NOW()),
(4, 'React Handbook', 'Alice Brown', '978-2-1234-5681-9', 1, 6, 4, NOW(), NOW()),
(5, 'Physique Quantique', 'Dr. Einstein', '978-2-1234-5682-6', 2, 2, 2, NOW(), NOW()),
(6, 'Le Petit Prince', 'Antoine de Saint-Exupéry', '978-2-1234-5683-3', 3, 8, 7, NOW(), NOW()),
(7, 'Histoire de France', 'Michel Historian', '978-2-1234-5684-0', 4, 3, 2, NOW(), NOW()),
(8, 'Économie Moderne', 'Paul Economist', '978-2-1234-5685-7', 5, 4, 3, NOW(), NOW());

-- Insérer les emprunts
INSERT INTO loans (id, user_id, book_id, loan_date, due_date, return_date, status, created_at, updated_at) VALUES 
(1, 1, 1, '2024-10-15', '2024-11-15', NULL, 'active', NOW(), NOW()),
(2, 2, 2, '2024-10-20', '2024-11-20', NULL, 'active', NOW(), NOW()),
(3, 3, 3, '2024-10-25', '2024-11-25', NULL, 'active', NOW(), NOW()),
(4, 1, 4, '2024-09-01', '2024-10-01', '2024-09-28', 'returned', NOW(), NOW()),
(5, 2, 1, '2024-08-15', '2024-09-15', NULL, 'active', NOW(), NOW());

-- Créer la table settings si elle n'existe pas
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer les paramètres
INSERT IGNORE INTO settings (`key`, value, description) VALUES 
('penalty_rate', '300', 'Montant de la pénalité par jour de retard (en CFA)'),
('loan_duration', '30', 'Durée d\'emprunt par défaut (en jours)'),
('max_loans_per_user', '5', 'Nombre maximum d\'emprunts par utilisateur');

SELECT 'Base de données initialisée avec succès!' as message;