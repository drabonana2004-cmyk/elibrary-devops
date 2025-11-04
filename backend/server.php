<?php

// Serveur PHP simple pour l'API eLibrary
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Gérer les requêtes CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($requestMethod === 'OPTIONS') {
    exit(0);
}

// Router les requêtes API
if (strpos($requestUri, '/api/') === 0) {
    include 'test_api.php';
    exit;
}

// Servir les fichiers statiques
$filePath = __DIR__ . $requestUri;

if (is_file($filePath)) {
    return false; // Laisser PHP servir le fichier
}

// Page par défaut
echo json_encode(['message' => 'eLibrary API Server', 'status' => 'running']);