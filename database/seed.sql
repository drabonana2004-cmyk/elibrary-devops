-- Données de test eLibrary
USE elibrary;

-- Utilisateurs de test
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@elibrary.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Livres de test
INSERT INTO books (title, author, isbn, category, description, available) VALUES
('Laravel Guide', 'Taylor Otwell', '978-0123456789', 'Programming', 'Guide complet Laravel', TRUE),
('Angular Basics', 'Google Team', '978-0987654321', 'Programming', 'Introduction à Angular', TRUE),
('DevOps Handbook', 'Gene Kim', '978-1942788003', 'Technology', 'Pratiques DevOps', TRUE),
('Kubernetes in Action', 'Marko Luksa', '978-1617293726', 'Technology', 'Guide Kubernetes', FALSE),
('Docker Deep Dive', 'Nigel Poulton', '978-1521822807', 'Technology', 'Maîtriser Docker', TRUE);