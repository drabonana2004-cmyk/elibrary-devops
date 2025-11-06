@echo off
echo ========================================
echo TEST CONNEXION ADMIN - ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE BACKEND:
echo =====================
cd backend
echo Demarrage serveur Laravel...
start /b php artisan serve --host=0.0.0.0 --port=8000
timeout /t 3 /nobreak >nul

echo.
echo 2. TEST API LOGIN:
echo ==================
echo Test connexion admin via API...
curl -X POST http://localhost:8000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo.
echo Test connexion admin@elibrary.com...
curl -X POST http://localhost:8000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@elibrary.com\",\"password\":\"admin123\"}"

echo.
echo.
echo 3. DEMARRAGE FRONTEND:
echo ======================
cd ..\frontend
echo Demarrage Angular...
start /b ng serve --host 0.0.0.0 --port 4200
timeout /t 5 /nobreak >nul

echo.
echo 4. OUVERTURE NAVIGATEUR:
echo ========================
start http://localhost:4200

echo.
echo ========================================
echo SERVICES DEMARRES !
echo ========================================
echo Frontend: http://localhost:4200
echo Backend: http://localhost:8000
echo.
echo COMPTES ADMIN DISPONIBLES:
echo - admin / admin
echo - admin@elibrary.com / admin123
echo.
pause