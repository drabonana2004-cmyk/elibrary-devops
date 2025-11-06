-- Script SQL pour créer admin avec identifiants personnalisés
USE elibrary;

-- Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Supprimer tous les admins existants
DELETE FROM users WHERE role = 'admin' OR email = 'admin@gmail.com';

-- Créer le nouvel admin avec vos identifiants
-- Email: admin@gmail.com
-- Password: admin123 (hashé avec bcrypt)
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
    'Administrator',
    'admin@gmail.com',
    '$2y$10$EuWkzWjr8RqPhx8fVN6dLOLvblfyoA7YvzN8xWJkYQOtJz.6qOyoG',
    'admin',
    NOW(),
    NOW()
);

-- Vérifier la création
SELECT id, name, email, role, created_at FROM users WHERE email = 'admin@gmail.com';

-- Confirmation
SELECT 'Admin créé avec succès: admin@gmail.com / admin123' as status;