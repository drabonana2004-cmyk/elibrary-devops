@echo off
echo ========================================
echo CORRECTION BOUTON CONNEXION ELIBRARY
echo ========================================

cd /d "c:\Users\drabo\Documents\elibrary\frontend\src\app\auth"

echo.
echo 1. SAUVEGARDE ANCIEN FICHIER:
echo =============================
if exist "login.component.ts.backup" (
    echo Sauvegarde existante trouvee
) else (
    copy "login.component.ts" "login.component.ts.backup"
    echo Sauvegarde creee
)

echo.
echo 2. REMPLACEMENT PAR VERSION SIMPLE:
echo ==================================
copy "login-simple.component.ts" "login.component.ts"
echo Fichier remplace

echo.
echo 3. MISE A JOUR CLASSE:
echo =====================
powershell -Command "(Get-Content 'login.component.ts') -replace 'LoginSimpleComponent', 'LoginComponent' | Set-Content 'login.component.ts'"
echo Classe mise a jour

echo.
echo 4. REDEMARRAGE FRONTEND:
echo =======================
cd /d "c:\Users\drabo\Documents\elibrary\frontend"
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Demarrage Angular...
start /b npx ng serve --port 4201

echo.
echo 5. ATTENTE COMPILATION:
echo ======================
timeout /t 15 /nobreak >nul

echo.
echo 6. OUVERTURE NAVIGATEUR:
echo =======================
start http://localhost:4201

echo.
echo ========================================
echo CORRECTION APPLIQUEE !
echo ========================================
echo.
echo IDENTIFIANTS ADMIN:
echo Email: admin@gmail.com
echo Mot de passe: admin123
echo.
echo Le bouton de connexion devrait maintenant fonctionner.
echo Si probleme persiste, ouvrez la console du navigateur (F12)
echo.
pause