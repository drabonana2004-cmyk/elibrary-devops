@echo off
echo ========================================
echo    eLibrary - Systeme de Bibliotheque
echo ========================================
echo.

echo 1. Creation de la base de donnees...
php create-complete-db.php

echo.
echo 2. Demarrage du serveur backend (port 8000)...
cd backend
start "eLibrary Backend" cmd /k "php -S localhost:8000 api.php"

echo.
echo 3. Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo 4. Demarrage du serveur frontend (port 4200)...
cd ..\frontend
start "eLibrary Frontend" cmd /k "npx ng serve --port 4200"

echo.
echo 5. Attente du demarrage complet (15 secondes)...
timeout /t 15 /nobreak >nul

echo 6. Ouverture de l'application...
start http://localhost:4200

echo.
echo ========================================
echo    eLibrary est maintenant actif !
echo ========================================
echo.
echo URLs d'acces :
echo - Application : http://localhost:4200
echo - API Backend : http://localhost:8000
echo.
echo Comptes de test :
echo - Admin : admin@elibrary.com / password
echo - User  : jean@example.com / password
echo - User  : marie@example.com / password
echo.
echo Fonctionnalites :
echo [ADMIN] Gestion livres, emprunts, statistiques
echo [USER]  Catalogue, emprunts, notifications
echo.
echo Base de donnees : SQLite (backend/database/database.sqlite)
echo.
pause