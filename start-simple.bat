@echo off
echo ========================================
echo    eLibrary - Demarrage Simple
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
echo    Serveurs demarres !
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000/api
echo Frontend:    http://localhost:4200
echo.
echo Les livres de test seront crees automatiquement
echo au premier lancement de l'interface utilisateur.
echo.

pause