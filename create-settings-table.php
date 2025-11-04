<?php
require_once 'backend/vendor/autoload.php';

$host = '127.0.0.1';
$dbname = 'elibrary';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Créer la table settings
    $sql = "CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `key` VARCHAR(255) NOT NULL UNIQUE,
        value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Insérer les paramètres par défaut
    $settings = [
        ['penalty_rate', '300', 'Montant de la pénalité par jour de retard (en CFA)'],
        ['loan_duration', '30', 'Durée d\'emprunt par défaut (en jours)'],
        ['max_loans_per_user', '5', 'Nombre maximum d\'emprunts par utilisateur']
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO settings (`key`, value, description) VALUES (?, ?, ?)");
    foreach ($settings as $setting) {
        $stmt->execute($setting);
    }
    
    echo "Table settings créée avec succès!\n";
    
} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
?>