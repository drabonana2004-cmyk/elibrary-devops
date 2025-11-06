@echo off
echo ========================================
echo CORRECTION FRONTEND - Cannot GET /
echo ========================================

echo.
echo 1. ARRET SERVICES EXISTANTS:
echo ============================
kubectl delete deployment frontend -n elibrary 2>nul
kubectl delete service frontend-service -n elibrary 2>nul
kubectl delete configmap frontend-html -n elibrary 2>nul

echo.
echo 2. BUILD IMAGE DOCKER:
echo ======================
cd frontend
echo Building Docker image...
docker build -t elibrary-frontend:latest .
if %errorlevel% neq 0 (
    echo ERREUR: Build Docker failed
    pause
    exit /b 1
)

echo.
echo 3. REDEMARRAGE KUBERNETES:
echo ==========================
cd ..
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo 4. ATTENTE DEMARRAGE:
echo ====================
echo Attente du pod...
timeout /t 10 /nobreak >nul

echo.
echo 5. VERIFICATION:
echo ===============
kubectl get pods -n elibrary -l app=frontend
kubectl get svc -n elibrary frontend-service

echo.
echo 6. PORT FORWARD:
echo ===============
echo Demarrage port-forward...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary

echo.
echo 7. TEST ACCES:
echo =============
timeout /t 5 /nobreak >nul
echo Test de l'URL...
curl -I http://localhost:4200

echo.
echo ========================================
echo FRONTEND CORRIGE !
echo ========================================
echo URL: http://localhost:4200
echo.
pause