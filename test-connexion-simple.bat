@echo off
title Test Connexion Admin eLibrary

echo ========================================
echo TEST CONNEXION ADMIN - VERSION SIMPLE
echo ========================================

cd /d "c:\Users\drabo\Documents\elibrary\frontend"

echo.
echo Arret des processus existants...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Demarrage Angular...
start /b npx ng serve --port 4201

echo.
echo Attente 15 secondes pour la compilation...
timeout /t 15 /nobreak >nul

echo.
echo Ouverture du navigateur...
start http://localhost:4201

echo.
echo ========================================
echo IDENTIFIANTS ADMIN:
echo Email: admin@gmail.com
echo Mot de passe: admin123
echo ========================================
echo.
echo Les messages en rouge dans la console sont normaux
echo en mode developpement. Seules les erreurs de 
echo compilation empechent le fonctionnement.
echo.
pause