-- Données de test pour eLibrary
USE elibrary;

-- Insertion des catégories
INSERT INTO categories (name, description, color, icon) VALUES
('Fiction', 'Romans et nouvelles', '#FF6347', 'fa-book-open'),
('Science-Fiction', 'Science-fiction et fantasy', '#4682B4', 'fa-rocket'),
('Histoire', 'Livres d\'histoire', '#D2691E', 'fa-landmark'),
('Philosophie', 'Ouvrages philosophiques', '#9370DB', 'fa-brain'),
('Informatique', 'Programmation et technologie', '#20B2AA', 'fa-laptop-code'),
('Romance', 'Romans d\'amour', '#FF69B4', 'fa-heart'),
('Thriller', 'Suspense et thriller', '#2F4F4F', 'fa-mask'),
('Action', 'Romans d\'action', '#DC143C', 'fa-fist-raised'),
('Romantique', 'Littérature romantique', '#FF1493', 'fa-rose'),
('Fait Divers', 'Actualités et faits divers', '#32CD32', 'fa-newspaper');

-- Insertion de l'administrateur
INSERT INTO users (name, email, password, role, status, phone, address) VALUES
('Administrateur', 'admin@elibrary.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'approved', '+33123456789', '123 Rue de la Bibliothèque, Paris');

-- Insertion d'utilisateurs de test
INSERT INTO users (name, email, password, status, phone, motivation) VALUES
('Jean Dupont', 'jean.dupont@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'approved', '+33123456790', 'Passionné de lecture, je souhaite accéder à une large collection de livres.'),
('Marie Martin', 'marie.martin@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'approved', '+33123456791', 'Étudiante en littérature, j\'ai besoin d\'accéder à des ouvrages spécialisés.'),
('Pierre Durand', 'pierre.durand@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', '+33123456792', 'Développeur passionné par les livres techniques.'),
('Sophie Bernard', 'sophie.bernard@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'approved', '+33123456793', 'Amatrice de romans historiques et de biographies.');

-- Insertion des livres
INSERT INTO books (title, author, isbn, category_id, description, publisher, publication_year, pages, cover_image, total_copies, available_copies, location, added_by) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070408504', 1, 'Un conte poétique et philosophique', 'Gallimard', 1943, 96, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300', 3, 3, 'A1-001', 1),
('1984', 'George Orwell', '9782070368228', 2, 'Roman dystopique sur la surveillance', 'Gallimard', 1949, 342, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300', 2, 2, 'A1-002', 1),
('Sapiens', 'Yuval Noah Harari', '9782226257017', 3, 'Une brève histoire de l\'humanité', 'Albin Michel', 2015, 512, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 4, 4, 'B2-001', 1),
('Méditations', 'Marc Aurèle', '9782080712059', 4, 'Pensées philosophiques de l\'empereur romain', 'Flammarion', 180, 256, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 2, 2, 'C3-001', 1),
('Clean Code', 'Robert C. Martin', '9780132350884', 5, 'Guide pour écrire du code propre', 'Prentice Hall', 2008, 464, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300', 3, 3, 'D4-001', 1),
('Orgueil et Préjugés', 'Jane Austen', '9782070413119', 6, 'Roman d\'amour classique', 'Gallimard', 1813, 448, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 2, 1, 'E5-001', 1),
('Gone Girl', 'Gillian Flynn', '9782290078051', 7, 'Thriller psychologique captivant', 'J\'ai Lu', 2012, 672, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', 2, 2, 'F6-001', 1),
('Da Vinci Code', 'Dan Brown', '9782253121251', 8, 'Thriller d\'action et mystère', 'Le Livre de Poche', 2003, 574, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300', 3, 2, 'G7-001', 1),
('Jane Eyre', 'Charlotte Brontë', '9782070413126', 9, 'Roman gothique romantique', 'Gallimard', 1847, 624, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', 2, 2, 'H8-001', 1),
('Into the Wild', 'Jon Krakauer', '9782290339687', 10, 'Histoire vraie d\'aventure en Alaska', 'J\'ai Lu', 1996, 288, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', 2, 2, 'I9-001', 1);

-- Insertion de demandes d'emprunt
INSERT INTO borrow_requests (user_id, book_id, status, approved_by, approved_date, due_date) VALUES
(2, 1, 'active', 1, NOW(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(3, 2, 'active', 1, NOW(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(4, 6, 'pending', NULL, NULL, NULL),
(2, 3, 'returned', 1, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 6 DAY));

-- Insertion de notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(2, 'Emprunt approuvé', 'Votre demande d\'emprunt pour "Le Petit Prince" a été approuvée.', 'success'),
(3, 'Emprunt approuvé', 'Votre demande d\'emprunt pour "1984" a été approuvée.', 'success'),
(4, 'Demande en attente', 'Votre demande d\'emprunt pour "Orgueil et Préjugés" est en cours de traitement.', 'info'),
(2, 'Livre retourné', 'Merci d\'avoir retourné "Sapiens" à temps.', 'success');

-- Insertion de logs admin
INSERT INTO admin_logs (admin_id, action, target_type, target_id, description) VALUES
(1, 'APPROVE_BORROW', 'borrow_request', 1, 'Approbation de la demande d\'emprunt #1'),
(1, 'APPROVE_BORROW', 'borrow_request', 2, 'Approbation de la demande d\'emprunt #2'),
(1, 'ADD_BOOK', 'book', 1, 'Ajout du livre "Le Petit Prince"'),
(1, 'APPROVE_USER', 'user', 2, 'Approbation de l\'utilisateur Jean Dupont');