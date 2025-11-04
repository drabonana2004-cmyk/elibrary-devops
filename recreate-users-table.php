<?php

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Sauvegarder les données existantes
$existingUsers = $db->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);

// Supprimer et recréer la table users
$db->exec("DROP TABLE users");

$db->exec("
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    nom TEXT,
    prenom TEXT,
    date_naissance DATE,
    sexe TEXT CHECK(sexe IN ('M', 'F')),
    telephone TEXT,
    photo_path TEXT,
    matricule TEXT UNIQUE,
    date_inscription DATE DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
");

// Restaurer les données existantes avec matricules
foreach ($existingUsers as $user) {
    $matricule = ($user['role'] === 'admin') ? 'ADM' . str_pad($user['id'], 3, '0', STR_PAD_LEFT) : 'USR' . str_pad($user['id'], 3, '0', STR_PAD_LEFT);
    
    $stmt = $db->prepare("
        INSERT INTO users (id, name, email, password, role, matricule, date_inscription, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, date('now'), ?, ?)
    ");
    $stmt->execute([
        $user['id'], $user['name'], $user['email'], $user['password'], 
        $user['role'], $matricule, $user['created_at'], $user['updated_at']
    ]);
}

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

// Créer le dossier uploads
if (!file_exists('backend/uploads')) {
    mkdir('backend/uploads', 0777, true);
}

echo "✅ Table users recréée avec succès!\n";
echo "👤 Super Admin ajouté: admin@gmail.com / 11111111\n";
echo "🔢 Matricules générés pour tous les utilisateurs\n";
echo "📁 Dossier uploads créé\n";
?>