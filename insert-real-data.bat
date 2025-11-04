@echo off
echo Insertion des donnees reelles dans la base...

echo.
echo Connexion a MySQL et insertion des donnees...

mysql -u root -p -e "
USE elibrary;

-- Vider les tables
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM loans;
DELETE FROM books;
DELETE FROM categories;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- Categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES 
(1, 'Informatique', 'Livres de programmation', NOW(), NOW()),
(2, 'Sciences', 'Livres scientifiques', NOW(), NOW()),
(3, 'Litterature', 'Romans et oeuvres', NOW(), NOW());

-- Utilisateurs
INSERT INTO users (id, name, email, role, created_at, updated_at) VALUES 
(1, 'Marie Dupont', 'marie@email.com', 'student', NOW(), NOW()),
(2, 'Jean Martin', 'jean@email.com', 'student', NOW(), NOW()),
(3, 'Admin', 'admin@elibrary.com', 'librarian', NOW(), NOW());

-- Livres
INSERT INTO books (id, title, author, isbn, category_id, quantity, available_quantity, created_at, updated_at) VALUES 
(1, 'Laravel Guide', 'John Doe', '978-1234567890', 1, 5, 3, NOW(), NOW()),
(2, 'Angular Basics', 'Jane Smith', '978-1234567891', 1, 3, 2, NOW(), NOW()),
(3, 'Vue.js Essentials', 'Bob Wilson', '978-1234567892', 1, 4, 4, NOW(), NOW());

-- Emprunts
INSERT INTO loans (id, user_id, book_id, loan_date, due_date, status, created_at, updated_at) VALUES 
(1, 1, 1, '2024-11-01', '2024-12-01', 'active', NOW(), NOW()),
(2, 2, 2, '2024-11-02', '2024-12-02', 'active', NOW(), NOW());

SELECT 'Donnees inserees avec succes!' as message;
"

echo.
echo Donnees inserees! Redemarrez le serveur Laravel.
pause