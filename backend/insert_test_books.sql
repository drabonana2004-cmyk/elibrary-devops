-- Insérer les catégories
INSERT OR REPLACE INTO categories (id, name, description, created_at, updated_at) VALUES
(1, 'Fiction', 'Romans et nouvelles', datetime('now'), datetime('now')),
(2, 'Science-Fiction', 'Science-fiction et fantasy', datetime('now'), datetime('now')),
(3, 'Histoire', 'Livres d''histoire', datetime('now'), datetime('now')),
(4, 'Philosophie', 'Ouvrages philosophiques', datetime('now'), datetime('now')),
(5, 'Informatique', 'Livres techniques', datetime('now'), datetime('now')),
(6, 'Romance', 'Romans d''amour', datetime('now'), datetime('now')),
(7, 'Thriller', 'Suspense et thriller', datetime('now'), datetime('now')),
(8, 'Biographie', 'Biographies et autobiographies', datetime('now'), datetime('now')),
(9, 'Jeunesse', 'Livres pour enfants et adolescents', datetime('now'), datetime('now')),
(10, 'Essais', 'Essais et analyses', datetime('now'), datetime('now'));

-- Insérer les livres de test
INSERT OR REPLACE INTO books (id, title, author, isbn, category_id, quantity, available_quantity, description, created_at, updated_at) VALUES
(1, 'Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070408504', 1, 5, 5, 'Un conte poétique et philosophique sous l''apparence d''un conte pour enfants.', datetime('now'), datetime('now')),
(2, 'Dune', 'Frank Herbert', '9782266320580', 2, 3, 3, 'Une épopée de science-fiction dans un univers désertique lointain.', datetime('now'), datetime('now')),
(3, 'L''Histoire de France', 'Ernest Lavisse', '9782253906827', 3, 4, 4, 'Une histoire complète de la France des origines à nos jours.', datetime('now'), datetime('now')),
(4, 'Méditations métaphysiques', 'René Descartes', '9782080706270', 4, 2, 2, 'Les fondements de la philosophie moderne par Descartes.', datetime('now'), datetime('now')),
(5, 'Clean Code', 'Robert C. Martin', '9780132350884', 5, 6, 6, 'Guide pour écrire du code propre et maintenable.', datetime('now'), datetime('now')),
(6, 'Orgueil et Préjugés', 'Jane Austen', '9782253004226', 6, 4, 4, 'Un classique de la littérature romantique anglaise.', datetime('now'), datetime('now')),
(7, 'Da Vinci Code', 'Dan Brown', '9782253121251', 7, 5, 5, 'Un thriller captivant mêlant art, histoire et mystère.', datetime('now'), datetime('now')),
(8, 'Steve Jobs', 'Walter Isaacson', '9782709638326', 8, 3, 3, 'La biographie officielle du fondateur d''Apple.', datetime('now'), datetime('now')),
(9, 'Harry Potter à l''école des sorciers', 'J.K. Rowling', '9782070541270', 9, 8, 8, 'Le premier tome de la saga du jeune sorcier.', datetime('now'), datetime('now')),
(10, 'Sapiens', 'Yuval Noah Harari', '9782226257017', 10, 4, 4, 'Une brève histoire de l''humanité.', datetime('now'), datetime('now')),
(11, '1984', 'George Orwell', '9782070368228', 1, 6, 6, 'Un roman dystopique sur la surveillance et le totalitarisme.', datetime('now'), datetime('now')),
(12, 'Fondation', 'Isaac Asimov', '9782070360260', 2, 3, 3, 'Le premier tome du cycle de Fondation.', datetime('now'), datetime('now')),
(13, 'Les Misérables', 'Victor Hugo', '9782253096337', 1, 4, 4, 'Le chef-d''œuvre de Victor Hugo sur la France du XIXe siècle.', datetime('now'), datetime('now')),
(14, 'Algorithmes', 'Thomas H. Cormen', '9782100545261', 5, 2, 2, 'Introduction aux algorithmes et structures de données.', datetime('now'), datetime('now')),
(15, 'Gone Girl', 'Gillian Flynn', '9782253183457', 7, 3, 3, 'Un thriller psychologique sur un couple en crise.', datetime('now'), datetime('now'));