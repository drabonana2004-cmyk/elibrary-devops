@echo off
echo ========================================
echo    eLibrary - Demarrage Rapide
echo ========================================
echo.

echo Etape 1: Installation des dependances backend...
cd backend
if not exist vendor (
    echo Installation Composer...
    php ..\composer.phar install --no-dev --optimize-autoloader
)

echo.
echo Etape 2: Installation des dependances frontend...
cd ..\frontend
if not exist node_modules (
    echo Installation NPM...
    npm install --production
)

echo.
echo Etape 3: Demarrage des serveurs...
echo.

echo Backend Laravel (port 8000)...
cd ..\backend
start "Laravel API" cmd /k "php -S localhost:8000 -t public"

timeout /t 3 /nobreak >nul

echo Frontend Angular (port 4200)...
cd ..\frontend
start "Angular App" cmd /k "npx ng serve --port 4200"

echo.
echo Attente du demarrage...
timeout /t 10 /nobreak >nul

echo Ouverture du navigateur...
start http://localhost:4200

echo.
echo ========================================
echo Application demarree !
echo ========================================
echo Frontend: http://localhost:4200
echo Backend:  http://localhost:8000
echo.
echo IMPORTANT: Configurez d'abord la base MySQL
echo Executez: setup-database.bat
echo.
pause