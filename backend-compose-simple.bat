@echo off
echo ========================================
echo BACKEND COMPOSE SIMPLE
echo ========================================

echo.
echo DEMARRAGE BACKEND UNIQUEMENT:
echo =============================
docker-compose up -d backend

echo.
echo ATTENTE DEMARRAGE...
timeout /t 10 /nobreak >nul

echo.
echo TEST API:
echo =========
curl http://localhost:8000/api/health

echo.
echo ========================================
echo BACKEND ACTIF !
echo ========================================
echo URL: http://localhost:8000
echo.
pause