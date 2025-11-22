@echo off
echo ========================================
echo TEST PHOTO UTILISATEUR
echo ========================================

echo 1. Verification des fichiers...
if exist "frontend\src\assets\default-avatar.svg" (
    echo [OK] Avatar par defaut present
) else (
    echo [ERREUR] Avatar par defaut manquant
)

echo.
echo 2. Composants modifies:
echo - Books Component: Header avec photo utilisateur
echo - AuthService: Gestion des photos
echo - Avatar par defaut: SVG cree

echo.
echo 3. Pour tester:
echo - Connectez-vous avec un utilisateur
echo - Allez sur la page Catalogue
echo - La photo doit apparaitre a cote du nom

echo.
echo 4. Fonctionnalites:
echo - Photo utilisateur dans le header du catalogue
echo - Nom utilisateur dynamique
echo - Badge de statut (Certifie/En attente)
echo - Fallback vers avatar par defaut

echo.
echo ========================================
echo REDEMARREZ LE FRONTEND POUR VOIR LES CHANGEMENTS
echo ========================================
echo.
echo ng serve --host=0.0.0.0 --port=4200
echo.
pause