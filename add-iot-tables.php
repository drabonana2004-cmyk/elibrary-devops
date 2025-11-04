<?php

$db = new PDO('sqlite:backend/database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ajouter les tables IoT
$db->exec("
-- Table des dispositifs IoT
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT UNIQUE NOT NULL,
    name TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des tags RFID pour les livres
CREATE TABLE IF NOT EXISTS book_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    tag_uid TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Table des événements IoT
CREATE TABLE IF NOT EXISTS iot_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    tag_uid TEXT NOT NULL,
    user_id INTEGER,
    book_id INTEGER,
    event_type TEXT DEFAULT 'scan',
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
");

// Ajouter des tags de test pour les livres existants
$db->exec("
INSERT OR IGNORE INTO devices (device_id, name, location) VALUES
('pi_1', 'Raspberry Pi Kiosque', 'Entrée bibliothèque'),
('pi_2', 'Raspberry Pi Retour', 'Bureau bibliothécaire');

INSERT OR IGNORE INTO book_tags (book_id, tag_uid) VALUES
(1, 'A1B2C3D4'),  -- Le Petit Prince
(2, 'E5F6G7H8'),  -- 1984
(3, 'I9J0K1L2'),  -- Algorithmique
(4, 'M3N4O5P6'),  -- Histoire de France
(5, 'Q7R8S9T0'),  -- Méditations
(6, 'U1V2W3X4'),  -- Clean Code
(7, 'Y5Z6A7B8'),  -- Sapiens
(8, 'C9D0E1F2');  -- Art de la Guerre
");

echo "✅ Tables IoT ajoutées avec succès!\n";
echo "📱 2 dispositifs créés\n";
echo "🏷️ 8 tags RFID assignés aux livres\n";
echo "\nTags de test:\n";
echo "- Le Petit Prince: A1B2C3D4\n";
echo "- 1984: E5F6G7H8\n";
echo "- Algorithmique: I9J0K1L2\n";
echo "- Histoire de France: M3N4O5P6\n";
?>