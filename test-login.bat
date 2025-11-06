@echo off
echo ========================================
echo TEST CONNEXION ELIBRARY
echo ========================================

echo.
echo 1. REBUILD FRONTEND:
echo ===================
cd frontend
docker build -t elibrary-frontend:latest .

echo.
echo 2. RESTART KUBERNETES:
echo ======================
cd ..
kubectl delete pod -l app=frontend -n elibrary
timeout /t 5 /nobreak >nul

echo.
echo 3. PORT FORWARD:
echo ===============
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 5 /nobreak >nul

echo.
echo 4. OUVERTURE NAVIGATEUR:
echo =======================
start http://localhost:4200

echo.
echo ========================================
echo IDENTIFIANTS DE TEST:
echo ========================================
echo Admin: admin@gmail.com / admin123
echo User:  user@test.com / user123
echo ========================================
pause