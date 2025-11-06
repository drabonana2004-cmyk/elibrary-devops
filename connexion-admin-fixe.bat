@echo off
echo ========================================
echo CONNEXION ADMIN ELIBRARY - VERSION FIXE
echo ========================================

echo.
echo 1. NETTOYAGE COMPLET:
echo ====================
cd /d "c:\Users\drabo\Documents\elibrary"
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo.
echo 2. VERIFICATION STRUCTURE:
echo ==========================
if not exist "frontend\src\app\auth\login.component.ts" (
    echo ERREUR: Fichier login.component.ts non trouve
    pause
    exit /b 1
)
echo Structure OK

echo.
echo 3. DEMARRAGE FRONTEND:
echo =====================
cd frontend
echo Demarrage Angular sur port 4201...
start /b cmd /c "npx ng serve --port 4201 --host 0.0.0.0 2>nul"

echo.
echo 4. ATTENTE COMPILATION:
echo ======================
echo Compilation en cours...
timeout /t 20 /nobreak >nul

echo.
echo 5. VERIFICATION SERVICE:
echo =======================
curl -s http://localhost:4201 >nul 2>&1
if %errorlevel% neq 0 (
    echo Service non encore pret, attente supplementaire...
    timeout /t 10 /nobreak >nul
)

echo.
echo 6. OUVERTURE NAVIGATEUR:
echo =======================
start http://localhost:4201

echo.
echo ========================================
echo CONNEXION ADMIN CONFIGUREE !
echo ========================================
echo.
echo IDENTIFIANTS CORRECTS:
echo ----------------------
echo Email: admin@gmail.com
echo Mot de passe: admin123
echo.
echo INSTRUCTIONS:
echo 1. Attendez le chargement complet de la page
echo 2. Saisissez exactement: admin@gmail.com
echo 3. Saisissez exactement: admin123
echo 4. Cliquez "Se connecter"
echo.
echo ERREURS ANGULAR (normales en dev):
echo - Warnings en jaune: IGNORER
echo - Messages "This is a simple server": IGNORER
echo - Seules les erreurs rouges de compilation comptent
echo.
echo Si probleme: Ctrl+C puis relancer ce script
echo.
pause