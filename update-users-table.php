<?php

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ajouter les nouvelles colonnes à la table users
$db->exec("
ALTER TABLE users ADD COLUMN nom TEXT;
ALTER TABLE users ADD COLUMN prenom TEXT;
ALTER TABLE users ADD COLUMN date_naissance DATE;
ALTER TABLE users ADD COLUMN sexe TEXT;
ALTER TABLE users ADD COLUMN telephone TEXT;
ALTER TABLE users ADD COLUMN photo_path TEXT;
ALTER TABLE users ADD COLUMN matricule TEXT UNIQUE;
ALTER TABLE users ADD COLUMN date_inscription DATE DEFAULT CURRENT_DATE;
");

// Ajouter le super admin
$db->exec("
INSERT OR REPLACE INTO users (
    name, email, password, role, nom, prenom, 
    date_naissance, sexe, telephone, matricule, date_inscription
) VALUES (
    'Super Admin', 'admin@gmail.com', 'password', 'admin',
    'Admin', 'Super', '1990-01-01', 'M', '0000000000',
    'SA001', date('now')
);
");

// Mettre à jour les utilisateurs existants avec des matricules
$db->exec("
UPDATE users SET matricule = 'ADM' || printf('%03d', id) WHERE role = 'admin' AND matricule IS NULL;
UPDATE users SET matricule = 'USR' || printf('%03d', id) WHERE role = 'user' AND matricule IS NULL;
UPDATE users SET date_inscription = date('now') WHERE date_inscription IS NULL;
");

echo "✅ Table users mise à jour avec succès!\n";
echo "👤 Super Admin ajouté: admin@gmail.com / 11111111\n";
echo "🔢 Matricules générés pour tous les utilisateurs\n";
?>