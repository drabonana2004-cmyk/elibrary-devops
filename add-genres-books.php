<?php

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ajouter la colonne genre aux livres
$db->exec("ALTER TABLE books ADD COLUMN genre TEXT DEFAULT 'Fiction'");

// Mettre à jour les livres existants avec genres et descriptions
$db->exec("
UPDATE books SET 
    genre = 'Fiction',
    description = 'Un conte philosophique et poétique sur l''amitié, l''amour et la condition humaine. L''histoire d''un petit prince qui voyage de planète en planète.'
WHERE id = 1;

UPDATE books SET 
    genre = 'Science-Fiction',
    description = 'Roman dystopique décrivant une société totalitaire où la surveillance de masse et la manipulation de l''information règnent en maître.'
WHERE id = 2;

UPDATE books SET 
    genre = 'Informatique',
    description = 'Manuel de référence complet en algorithmique couvrant les structures de données, les algorithmes de tri, de recherche et d''optimisation.'
WHERE id = 3;

UPDATE books SET 
    genre = 'Histoire',
    description = 'Histoire complète et passionnante de la France depuis ses origines jusqu''au XIXe siècle, écrite par l''un des plus grands historiens français.'
WHERE id = 4;

UPDATE books SET 
    genre = 'Philosophie',
    description = 'Œuvre fondamentale de la philosophie moderne où Descartes établit les bases de la méthode scientifique et du rationalisme.'
WHERE id = 5;

UPDATE books SET 
    genre = 'Informatique',
    description = 'Guide pratique pour écrire du code propre, maintenable et efficace. Techniques et bonnes pratiques pour développeurs professionnels.'
WHERE id = 6;

UPDATE books SET 
    genre = 'Histoire',
    description = 'Une brève histoire de l''humanité depuis l''apparition d''Homo sapiens jusqu''à nos jours. Analyse brillante de l''évolution humaine.'
WHERE id = 7;

UPDATE books SET 
    genre = 'Philosophie',
    description = 'Traité de stratégie militaire et politique ancien, applicable aux affaires et à la vie quotidienne. Sagesse intemporelle sur l''art de la guerre.'
WHERE id = 8;
");

// Mettre à jour les catégories pour correspondre aux genres
$db->exec("
UPDATE categories SET name = 'Action' WHERE name = 'Fiction';
UPDATE categories SET name = 'Romantique' WHERE name = 'Science';
UPDATE categories SET name = 'Fait Divers' WHERE name = 'Histoire';
");

// Ajouter de nouveaux genres
$db->exec("
INSERT OR IGNORE INTO categories (name, description) VALUES
('Science-Fiction', 'Romans de science-fiction et anticipation'),
('Thriller', 'Romans à suspense et thrillers'),
('Biographie', 'Biographies et autobiographies');
");

echo "✅ Genres et descriptions ajoutés aux livres!\n";
echo "📚 8 livres mis à jour avec genres et descriptions détaillées\n";
echo "🏷️ Catégories mises à jour: Action, Romantique, Fait Divers\n";
?>