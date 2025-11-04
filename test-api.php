<?php
// Test des endpoints API

$baseUrl = 'http://127.0.0.1:8000/api';

function testEndpoint($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'response' => $response];
}

echo "=== Test des API eLibrary ===\n\n";

// Test Dashboard Stats
echo "1. Test Dashboard Stats...\n";
$result = testEndpoint($baseUrl . '/dashboard/stats');
echo "Status: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $data = json_decode($result['response'], true);
    echo "Livres: " . ($data['stats']['total_books'] ?? 0) . "\n";
    echo "Utilisateurs: " . ($data['stats']['total_users'] ?? 0) . "\n";
}
echo "\n";

// Test Categories
echo "2. Test Categories...\n";
$result = testEndpoint($baseUrl . '/categories');
echo "Status: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $categories = json_decode($result['response'], true);
    echo "Nombre de catégories: " . count($categories) . "\n";
}
echo "\n";

// Test Books
echo "3. Test Books...\n";
$result = testEndpoint($baseUrl . '/books');
echo "Status: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $books = json_decode($result['response'], true);
    echo "Nombre de livres: " . count($books) . "\n";
}
echo "\n";

// Test Penalties
echo "4. Test Penalties...\n";
$result = testEndpoint($baseUrl . '/penalties/overdue');
echo "Status: " . $result['code'] . "\n";
if ($result['code'] == 200) {
    $penalties = json_decode($result['response'], true);
    echo "Emprunts en retard: " . count($penalties) . "\n";
}
echo "\n";

// Test Reports Stats
echo "5. Test Reports Stats...\n";
$result = testEndpoint($baseUrl . '/reports/stats');
echo "Status: " . $result['code'] . "\n";
echo "\n";

echo "=== Tests terminés ===\n";
?>