@echo off
echo ========================================
echo CORRECTION ADMIN - KUBERNETES
echo ========================================

echo.
echo 1. RECONSTRUCTION IMAGES:
echo =========================
echo Build image backend avec AuthController...
cd backend
docker build -t elibrary-backend:latest .

echo Build image frontend avec correction auth...
cd ..\frontend
docker build -t elibrary-frontend:latest .

echo.
echo 2. REDEMARRAGE KUBERNETES:
echo ==========================
cd ..
echo Suppression anciens pods...
kubectl delete pods -l app=backend -n elibrary
kubectl delete pods -l app=frontend -n elibrary

echo Attente redemarrage...
timeout /t 10 /nobreak >nul

echo.
echo 3. VERIFICATION SERVICES:
echo =========================
kubectl get pods -n elibrary

echo.
echo 4. TEST API LOGIN:
echo ==================
echo Port-forward backend...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul

echo Test connexion admin...
curl -X POST http://localhost:8000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin\",\"password\":\"admin\"}"

echo.
echo 5. ACCES FRONTEND:
echo ==================
echo Port-forward frontend...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul

start http://localhost:4200

echo.
echo ========================================
echo CORRECTION APPLIQUEE !
echo ========================================
echo Frontend: http://localhost:4200
echo Backend API: http://localhost:8000/api
echo.
echo CONNEXION ADMIN:
echo - admin / admin
echo - admin@elibrary.com / admin123
echo.
pause