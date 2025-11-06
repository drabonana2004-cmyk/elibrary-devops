@echo off
echo ========================================
echo DEMARRAGE FRONTEND ELIBRARY - PORT LIBRE
echo ========================================

cd /d "c:\Users\drabo\Documents\elibrary\frontend"

echo.
echo 1. NETTOYAGE PROCESSUS:
echo =======================
echo Arret des processus Angular existants...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 2. VERIFICATION PORT:
echo ====================
netstat -ano | findstr :4200
if %errorlevel% equ 0 (
    echo Port 4200 occupe, utilisation port automatique...
) else (
    echo Port 4200 libre
)

echo.
echo 3. DEMARRAGE ANGULAR:
echo ====================
echo Demarrage sur port disponible...
start /b npx ng serve --port 0 --host 0.0.0.0

echo.
echo 4. ATTENTE DEMARRAGE:
echo ====================
timeout /t 10 /nobreak >nul

echo.
echo 5. OUVERTURE NAVIGATEUR:
echo ========================
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do set pid=%%a
for /f "tokens=5" %%a in ('netstat -ano ^| findstr node.exe') do (
    for /f "tokens=2 delims=:" %%b in ('netstat -ano ^| findstr %%a ^| findstr LISTENING') do (
        echo Frontend disponible sur: http://localhost:%%b
        start http://localhost:%%b
        goto :found
    )
)

:found
echo.
echo ========================================
echo FRONTEND DEMARRE !
echo ========================================
echo Identifiants admin:
echo Email: admin@gmail.com
echo Mot de passe: admin123
echo.
pause