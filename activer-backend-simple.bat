@echo off
echo ========================================
echo ACTIVATION BACKEND SIMPLE
echo ========================================

cd backend

echo.
echo 1. INSTALLATION DEPENDANCES:
echo ============================
if exist composer.phar (
    php composer.phar install --no-dev
) else (
    echo Telechargement Composer...
    curl -sS https://getcomposer.org/installer | php
    php composer.phar install --no-dev
)

echo.
echo 2. DEMARRAGE SERVEUR:
echo =====================
php artisan serve --host=0.0.0.0 --port=8000

pause