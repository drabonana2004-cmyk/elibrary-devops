@echo off
echo ========================================
echo MISE A JOUR GIT - ELIBRARY
echo ========================================

echo 1. Status Git:
git status

echo.
echo 2. Ajout de tous les fichiers:
git add .

echo.
echo 3. Commit avec message:
git commit -m "Fix: Correction deploiement Kubernetes et ajout scripts automatises - %date% %time%"

echo.
echo 4. Push vers GitHub:
git push origin main

echo.
echo ========================================
echo MISE A JOUR TERMINEE !
echo ========================================
pause