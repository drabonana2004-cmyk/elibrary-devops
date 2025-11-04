@echo off
echo ========================================
echo    Initialisation Base de Données
echo ========================================

echo.
echo Execution du script SQL...
mysql -u root -p elibrary < init-data.sql

echo.
echo ========================================
echo Base de données initialisée !
echo ========================================
echo.
pause