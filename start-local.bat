@echo off
echo ========================================
echo DEMARRAGE LOCAL ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE MYSQL:
docker-compose -f docker-compose.simple.yml up -d
timeout /t 5 /nobreak >nul

echo.
echo 2. INSTALLATION BACKEND:
cd backend
php composer.phar install
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Installation backend echouee
    pause
    exit /b 1
)

echo.
echo 3. DEMARRAGE BACKEND:
start "Backend Laravel" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo.
echo 4. DEMARRAGE FRONTEND:
cd ..\frontend
start "Frontend Angular" cmd /k "npx ng serve --host 0.0.0.0 --port 4200"

echo.
echo ========================================
echo APPLICATIONS DEMARREES !
echo ========================================
echo.
echo Acces:
echo - Frontend: http://localhost:4200
echo - Backend: http://localhost:8000
echo - MySQL: localhost:3306
echo.
pause