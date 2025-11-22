@echo off
echo ========================================
echo ARRET KUBERNETES + DEMARRAGE ANGULAR
echo ========================================

echo 1. ARRET DE KUBERNETES:
kubectl delete namespace elibrary --ignore-not-found=true
echo [OK] Namespace elibrary supprime

echo.
echo 2. VERIFICATION PORTS:
netstat -ano | findstr :4200
echo Si un processus utilise le port 4200, il sera libere

echo.
echo 3. DEMARRAGE MYSQL:
docker-compose -f docker-compose.simple.yml up -d
echo [OK] MySQL demarre

echo.
echo 4. DEMARRAGE BACKEND:
start "Backend Laravel" cmd /k "cd backend && php composer.phar install && php artisan serve --host=0.0.0.0 --port=8000"

echo.
echo 5. DEMARRAGE FRONTEND ANGULAR:
start "Frontend Angular" cmd /k "cd frontend && npm install && npx ng serve --host=0.0.0.0 --port=4200"

echo.
echo ========================================
echo APPLICATIONS DEMARREES !
echo ========================================
echo.
echo ACCES:
echo - Frontend Angular: http://localhost:4200
echo - Backend Laravel: http://localhost:8000
echo - MySQL: localhost:3306
echo.
echo MAINTENANT VOUS AUREZ LE VRAI FRONTEND ANGULAR
echo AVEC VOTRE PHOTO UTILISATEUR !
echo.
pause