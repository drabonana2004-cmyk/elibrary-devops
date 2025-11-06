@echo off
echo ========================================
echo FIX BACKEND PORT
echo ========================================

echo.
echo 1. ARRET TOUS SERVICES:
echo =======================
docker-compose down
docker stop $(docker ps -q) 2>nul

echo.
echo 2. NETTOYAGE PORTS:
echo ===================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a 2>nul

echo.
echo 3. REDEMARRAGE BACKEND:
echo ======================
docker-compose up -d backend

echo.
echo 4. ATTENTE ET TEST:
echo ===================
timeout /t 10 /nobreak >nul
curl http://localhost:8000/api/health

echo.
echo ========================================
echo BACKEND FIXE !
echo ========================================
pause