<?php
echo "Test de connexion à la base de données...\n\n";

$host = '127.0.0.1';
$dbname = 'elibrary';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    echo "✅ Connexion réussie!\n\n";
    
    // Test des tables
    $tables = ['categories', 'users', 'books', 'loans'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
        $count = $stmt->fetchColumn();
        echo "📊 Table $table: $count enregistrements\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Erreur de connexion: " . $e->getMessage() . "\n";
    echo "\n💡 Solutions possibles:\n";
    echo "1. Vérifier que MySQL est démarré\n";
    echo "2. Vérifier que la base 'elibrary' existe\n";
    echo "3. Vérifier les identifiants de connexion\n";
}
?>