@echo off
echo ========================================
echo    eLibrary - Configuration Complete
echo ========================================

echo.
echo 1. Creation de la table settings...
php create-settings-table.php

echo.
echo 2. Reinitialisation de la base de donnees...
php reset-database.php

echo.
echo 3. Demarrage du serveur Laravel...
start "Laravel Server" cmd /k "cd backend && php artisan serve --host=127.0.0.1 --port=8000"

echo.
echo 4. Attente du serveur Laravel...
timeout /t 3 /nobreak > nul

echo.
echo 5. Demarrage du serveur Angular...
start "Angular Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Configuration terminee !
echo.
echo Frontend: http://localhost:4200
echo Backend:  http://127.0.0.1:8000/api
echo ========================================
echo.
pause