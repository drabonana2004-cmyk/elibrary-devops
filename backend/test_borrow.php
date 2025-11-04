<?php

// Script de test pour vérifier les emprunts
echo "=== Test de l'API d'emprunt ===\n\n";

// Test 1: Obtenir les livres
echo "1. Test GET /api/books\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/books');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Code HTTP: $httpCode\n";
if ($response) {
    $books = json_decode($response, true);
    echo "Nombre de livres: " . count($books['data'] ?? []) . "\n";
    if (!empty($books['data'])) {
        echo "Premier livre: " . $books['data'][0]['title'] . "\n";
    }
} else {
    echo "Erreur: Pas de réponse\n";
}

echo "\n";

// Test 2: Demander un emprunt
echo "2. Test POST /api/request-borrow\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/request-borrow');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['book_id' => 1]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Code HTTP: $httpCode\n";
if ($response) {
    $result = json_decode($response, true);
    echo "Réponse: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
} else {
    echo "Erreur: Pas de réponse\n";
}

echo "\n";

// Test 3: Obtenir mes emprunts
echo "3. Test GET /api/my-borrows\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:8000/api/my-borrows');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Code HTTP: $httpCode\n";
if ($response) {
    $borrows = json_decode($response, true);
    echo "Nombre d'emprunts: " . count($borrows) . "\n";
    if (!empty($borrows)) {
        echo "Premier emprunt: " . $borrows[0]['title'] . "\n";
    }
} else {
    echo "Erreur: Pas de réponse\n";
}

echo "\n=== Fin des tests ===\n";