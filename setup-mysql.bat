@echo off
echo ========================================
echo    eLibrary - Setup MySQL Complet
echo ========================================

echo.
echo Etape 1: Verification de MySQL...
echo Assurez-vous que MySQL est demarré (XAMPP/WAMP/MAMP)
echo.

echo Etape 2: Creation de la base de donnees...
echo Tentative de creation automatique...

cd backend
php -r "
try {
    \$pdo = new PDO('mysql:host=127.0.0.1', 'root', '');
    \$pdo->exec('CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    echo 'Base de donnees creee avec succes!\n';
} catch (Exception \$e) {
    echo 'Erreur: ' . \$e->getMessage() . '\n';
    echo 'Veuillez creer manuellement la base de donnees elibrary\n';
}
"

echo.
echo Etape 3: Initialisation des donnees...
php init_mysql.php

echo.
echo Etape 4: Demarrage du serveur...
echo Backend API: http://127.0.0.1:8000/api
echo.

start "eLibrary Backend" php -S 127.0.0.1:8000 server.php

echo.
echo Serveur demarré ! Vous pouvez maintenant:
echo 1. Ouvrir http://localhost:4200 pour le frontend
echo 2. Tester l'API sur http://127.0.0.1:8000/api/books
echo.

pause