@echo off
echo ========================================
echo    MISE A JOUR GITHUB - eLibrary
echo ========================================
echo.

echo 1. Verification du statut Git...
git status
echo.

echo 2. Ajout de tous les fichiers modifies...
git add .
echo.

echo 3. Commit des modifications...
set /p message="Entrez le message de commit (ou appuyez sur Entree pour le message par defaut): "
if "%message%"=="" set message="Mise a jour: corrections notifications et synchronisation admin-user"

git commit -m "%message%"
echo.

echo 4. Push vers GitHub...
git push origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo    MISE A JOUR REUSSIE !
    echo ========================================
    echo.
    echo Vos modifications ont ete envoyees sur GitHub.
    echo Vous pouvez verifier sur: https://github.com/votre-username/elibrary-devops
) else (
    echo ========================================
    echo    ERREUR LORS DE LA MISE A JOUR
    echo ========================================
    echo.
    echo Verifiez votre connexion internet et vos identifiants Git.
)

echo.
pause