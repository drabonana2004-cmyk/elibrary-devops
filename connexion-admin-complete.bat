@echo off
echo ========================================
echo CONNEXION ADMIN ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE COMPLET:
echo =====================
docker-compose down
docker-compose up -d

echo.
echo 2. ATTENTE SERVICES:
echo ===================
timeout /t 15 /nobreak >nul

echo.
echo 3. VERIFICATION BACKEND:
echo ========================
curl http://localhost:8000/api/health

echo.
echo 4. TEST LOGIN ADMIN:
echo ===================
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo 5. OUVERTURE FRONTEND:
echo ======================
start http://localhost:4200

echo.
echo ========================================
echo CONNEXION ADMIN PRETE !
echo ========================================
echo Frontend: http://localhost:4200
echo Backend: http://localhost:8000
echo.
echo COMPTES ADMIN:
echo - admin / admin
echo - admin@elibrary.com / admin123
echo.
pause