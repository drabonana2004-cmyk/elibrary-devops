@echo off
echo ========================================
echo CORRECTION BACKEND LARAVEL LOCAL
echo ========================================

cd /d C:\Users\drabo\Documents\elibrary\backend

echo.
echo 1. INSTALLATION DEPENDANCES:
echo ============================
echo Installation Composer dependencies...
composer install --no-dev --optimize-autoloader

echo.
echo 2. CONFIGURATION LARAVEL:
echo =========================
echo Copie fichier environnement...
copy .env.example .env 2>nul || echo "Fichier .env deja present"

echo Generation cle application...
php artisan key:generate

echo.
echo 3. CONFIGURATION BASE DE DONNEES:
echo =================================
echo Configuration connexion MySQL...
echo DB_CONNECTION=mysql > .env.temp
echo DB_HOST=127.0.0.1 >> .env.temp
echo DB_PORT=3306 >> .env.temp
echo DB_DATABASE=elibrary >> .env.temp
echo DB_USERNAME=root >> .env.temp
echo DB_PASSWORD=secretpassword >> .env.temp
echo APP_KEY=%APP_KEY% >> .env.temp
move .env.temp .env

echo.
echo 4. MIGRATION BASE DE DONNEES:
echo ============================
echo Creation tables...
php artisan migrate --force

echo.
echo 5. DEMARRAGE SERVEUR:
echo =====================
echo Demarrage serveur Laravel...
echo Backend accessible sur: http://localhost:8000
echo.
php artisan serve --host=0.0.0.0 --port=8000