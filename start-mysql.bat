@echo off
echo ========================================
echo    eLibrary - Configuration MySQL
echo ========================================

echo.
echo 1. Demarrage de MySQL (XAMPP/WAMP/MAMP)...
echo Assurez-vous que MySQL est demarré dans votre serveur local.
echo.

echo 2. Creation de la base de donnees...
echo Executez cette commande dans MySQL :
echo.
echo CREATE DATABASE IF NOT EXISTS elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo.

echo 3. Importation des donnees de test...
echo Executez cette commande :
echo mysql -u root -p elibrary < backend/create_mysql_database.sql
echo.

echo 4. Demarrage du serveur Laravel...
cd backend
php -S 127.0.0.1:8000 -t . server.php

pause