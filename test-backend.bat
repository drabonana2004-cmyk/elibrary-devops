@echo off
echo Test du backend...
echo.

echo Initialisation base de donnees...
php init-database.php

echo.
echo Demarrage serveur backend...
cd backend
php -S localhost:8000 server.php