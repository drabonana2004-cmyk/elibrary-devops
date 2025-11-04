@echo off
echo ========================================
echo    eLibrary - Demarrage Application
echo ========================================

echo.
echo Demarrage du serveur backend...
cd backend
start "eLibrary Backend" php -S 127.0.0.1:8000 server.php

echo.
echo Attente du demarrage du serveur...
timeout /t 3 /nobreak > nul

echo.
echo Demarrage du frontend...
cd ..\frontend
start "eLibrary Frontend" npm start

echo.
echo ========================================
echo    Application demarree !
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000/api
echo Frontend:    http://localhost:4200
echo.
echo IMPORTANT:
echo - Les livres de test sont crees automatiquement
echo - Les emprunts fonctionnent meme sans base de donnees
echo - Utilisez admin/admin pour l'interface admin
echo - Creez un compte utilisateur et certifiez-le pour emprunter
echo.

pause