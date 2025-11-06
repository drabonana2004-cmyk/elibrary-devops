@echo off
echo ========================================
echo BACKEND DOCKER DIRECT
echo ========================================

cd backend

echo.
echo 1. BUILD IMAGE BACKEND:
echo =======================
docker build -t elibrary-backend .

echo.
echo 2. DEMARRAGE CONTAINER:
echo =======================
docker run -d --name elibrary-backend -p 8000:80 elibrary-backend

echo.
echo 3. TEST API:
echo ============
timeout /t 5 /nobreak >nul
curl http://localhost:8000/api/health

echo.
echo ========================================
echo BACKEND ACTIF !
echo ========================================
echo URL: http://localhost:8000
echo API: http://localhost:8000/api
echo.
pause