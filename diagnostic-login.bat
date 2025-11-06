@echo off
echo ========================================
echo DIAGNOSTIC PROBLEME CONNEXION
echo ========================================

cd /d "c:\Users\drabo\Documents\elibrary\frontend"

echo.
echo 1. VERIFICATION STRUCTURE:
echo ==========================
if exist "src\app\auth\login.component.ts" (
    echo [OK] login.component.ts existe
) else (
    echo [ERREUR] login.component.ts manquant
)

if exist "src\app\services\auth.service.ts" (
    echo [OK] auth.service.ts existe
) else (
    echo [ERREUR] auth.service.ts manquant
)

echo.
echo 2. VERIFICATION IMPORTS:
echo =======================
findstr /C:"AuthService" "src\app\auth\login.component.ts" >nul
if %errorlevel% equ 0 (
    echo [OK] AuthService importe
) else (
    echo [ERREUR] AuthService non importe
)

echo.
echo 3. VERIFICATION METHODE LOGIN:
echo =============================
findstr /C:"login()" "src\app\auth\login.component.ts" >nul
if %errorlevel% equ 0 (
    echo [OK] Methode login() presente
) else (
    echo [ERREUR] Methode login() manquante
)

echo.
echo 4. TEST COMPILATION:
echo ===================
echo Test de compilation Angular...
npx ng build --dry-run 2>compilation-errors.txt
if %errorlevel% equ 0 (
    echo [OK] Compilation reussie
) else (
    echo [ERREUR] Erreurs de compilation detectees
    echo Voir compilation-errors.txt pour details
)

echo.
echo 5. RECOMMANDATIONS:
echo ==================
echo Si erreurs detectees:
echo 1. Lancez: fix-login-button.bat
echo 2. Ou utilisez la version simple du login
echo 3. Verifiez la console du navigateur (F12)
echo.
pause