@echo off
echo ========================================
echo Fix: Affichage des livres pour tous les utilisateurs
echo ========================================

echo.
echo Demarrage des services...

echo.
echo 1. Demarrage MySQL
docker-compose -f docker-compose.simple.yml up -d mysql

echo.
echo 2. Attente de MySQL (10 secondes)
timeout /t 10 /nobreak

echo.
echo 3. Demarrage du backend Laravel
cd backend
start "Backend Laravel" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo.
echo 4. Attente du backend (5 secondes)
timeout /t 5 /nobreak

echo.
echo 5. Test de l'API des livres
curl -X GET "http://localhost:8000/api/books" -H "Content-Type: application/json"

echo.
echo 6. Demarrage du frontend Angular
cd ..\frontend
start "Frontend Angular" cmd /k "ng serve --host 0.0.0.0 --port 4200"

echo.
echo ========================================
echo Services demarres:
echo - MySQL: http://localhost:3306
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:4200
echo ========================================
echo.
echo Acces rapide:
echo - Catalogue public: http://localhost:4200/books
echo - Admin: admin / admin
echo - Test API: http://localhost:8000/api/test
echo ========================================

pause