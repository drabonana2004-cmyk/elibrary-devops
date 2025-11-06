@echo off
echo ========================================
echo CORRECTION - VRAIE APPLICATION ANGULAR
echo ========================================

echo.
echo 1. SUPPRESSION ANCIEN DEPLOIEMENT:
echo ==================================
kubectl delete deployment frontend -n elibrary
kubectl delete configmap frontend-html -n elibrary 2>nul

echo.
echo 2. BUILD IMAGE DOCKER:
echo ======================
cd frontend
echo Building Angular app...
docker build -t elibrary-frontend:latest .
if %errorlevel% neq 0 (
    echo ERREUR: Build failed
    pause
    exit /b 1
)

echo.
echo 3. NOUVEAU DEPLOIEMENT:
echo =======================
cd ..
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo 4. ATTENTE DEMARRAGE:
echo ====================
echo Attente du pod...
timeout /t 15 /nobreak >nul

echo.
echo 5. VERIFICATION:
echo ===============
kubectl get pods -n elibrary -l app=frontend

echo.
echo 6. PORT FORWARD:
echo ===============
echo Arret ancien port-forward...
taskkill /f /im kubectl.exe 2>nul
timeout /t 2 /nobreak >nul

echo Nouveau port-forward...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary

echo.
echo 7. OUVERTURE APPLICATION:
echo ========================
timeout /t 5 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo VRAIE APPLICATION DEPLOYEE !
echo ========================================
echo URL: http://localhost:4200
echo Login: admin@gmail.com / admin123
echo ========================================
pause