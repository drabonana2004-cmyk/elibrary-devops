@echo off
echo Configuration de la base de donnees eLibrary...
echo.

echo 1. Connexion a MySQL et creation de la base...
mysql -u root -p < create-database.sql

echo.
echo 2. Base de donnees creee avec succes !
echo.
echo Donnees de test ajoutees :
echo - 4 categories
echo - 3 utilisateurs (admin@elibrary.com / jean@example.com / marie@example.com)
echo - 4 livres
echo.
echo Mot de passe par defaut : password
echo.
pause