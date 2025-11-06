@echo off
echo ========================================
echo DEBUG BACKEND
echo ========================================

echo.
echo 1. VERIFICATION CONTAINERS:
echo ===========================
docker ps -a | findstr elibrary

echo.
echo 2. VERIFICATION PORTS:
echo ======================
netstat -an | findstr :8000

echo.
echo 3. DEMARRAGE FORCE:
echo ===================
docker-compose down
docker-compose up -d backend

echo.
echo 4. LOGS BACKEND:
echo ================
timeout /t 5 /nobreak >nul
docker-compose logs backend

echo.
echo 5. TEST CONNEXION:
echo ==================
curl -v http://localhost:8000/api/health

pause