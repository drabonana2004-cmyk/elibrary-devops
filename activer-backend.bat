@echo off
echo ========================================
echo ACTIVATION BACKEND ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE LOCAL:
echo ===================
cd backend
echo Demarrage serveur Laravel...
start cmd /k "php artisan serve --host=0.0.0.0 --port=8000"
timeout /t 3 /nobreak >nul

echo.
echo 2. TEST API:
echo ============
echo Test health check...
curl http://localhost:8000/api/health

echo.
echo Test login admin...
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo ========================================
echo BACKEND ACTIVE !
echo ========================================
echo URL: http://localhost:8000
echo API: http://localhost:8000/api
echo.
pause