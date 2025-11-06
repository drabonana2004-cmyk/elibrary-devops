@echo off
echo === Mise à jour GitHub ===

echo 1. Vérification du statut...
git status

echo.
echo 2. Ajout des fichiers modifiés...
git add .

echo.
echo 3. Commit des modifications...
git commit -m "Mise à jour: système de notifications et corrections"

echo.
echo 4. Push vers GitHub...
git push origin main

echo.
echo === Terminé ===
pause