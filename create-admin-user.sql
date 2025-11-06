-- Script SQL pour créer/réinitialiser l'utilisateur admin
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

-- Supprimer l'admin existant s'il existe
DELETE FROM users WHERE email = 'admin@elibrary.com';

-- Créer le nouvel utilisateur admin
-- Mot de passe: "password" (hashé avec bcrypt)
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES (
    'Administrator',
    'admin@elibrary.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin',
    NOW(),
    NOW()
);

-- Vérifier la création
SELECT id, name, email, role, created_at FROM users WHERE role = 'admin';

-- Afficher le résultat
SELECT 'Admin user created successfully!' as status;