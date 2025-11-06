@echo off
echo ========================================
echo TEST CONNEXION ADMIN ELIBRARY
echo ========================================

cd /d "c:\Users\drabo\Documents\elibrary\frontend"

echo.
echo 1. ARRET PROCESSUS EXISTANTS:
echo =============================
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 2. DEMARRAGE FRONTEND:
echo =====================
echo Demarrage Angular sur port 4201...
start /b npx ng serve --port 4201

echo.
echo 3. ATTENTE INITIALISATION:
echo =========================
timeout /t 15 /nobreak >nul

echo.
echo 4. OUVERTURE PAGE LOGIN:
echo =======================
start http://localhost:4201

echo.
echo ========================================
echo INSTRUCTIONS CONNEXION ADMIN:
echo ========================================
echo 1. Attendez que la page se charge
echo 2. Utilisez ces identifiants:
echo    Email: admin@gmail.com
echo    Mot de passe: admin123
echo 3. Cliquez sur "Se connecter"
echo.
echo Si erreurs rouges dans Angular:
echo - Ignorez les warnings de developpement
echo - Seules les erreurs de compilation comptent
echo.
pause