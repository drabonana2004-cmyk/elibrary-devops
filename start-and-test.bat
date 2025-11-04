@echo off
echo ========================================
echo    eLibrary - Demarrage et Test
echo ========================================

echo.
echo Demarrage du serveur backend...
cd backend
start "eLibrary Backend" php -S 127.0.0.1:8000 server.php

echo.
echo Attente du demarrage du serveur...
timeout /t 5 /nobreak > nul

echo.
echo Test de l'API...
php test_borrow.php

echo.
echo Demarrage du frontend...
cd ..\frontend
start "eLibrary Frontend" npm start

echo.
echo ========================================
echo    Tout est pret !
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000/api
echo Frontend:    http://localhost:4200
echo.
echo Les tests API sont affiches ci-dessus.
echo Si tout fonctionne, vous pouvez maintenant
echo tester les emprunts dans l'interface utilisateur.
echo.

pause