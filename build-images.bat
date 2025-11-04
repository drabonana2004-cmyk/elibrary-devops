@echo off
echo ========================================
echo BUILD IMAGES DOCKER - ELIBRARY
echo ========================================

echo.
echo 1. BUILD FRONTEND:
cd frontend
docker build -t elibrary-frontend:latest .
if %errorlevel% neq 0 (
    echo [ERREUR] Build frontend echoue
    pause
    exit /b 1
)
echo [OK] Frontend build

echo.
echo 2. BUILD BACKEND:
cd ..\backend
docker build -t elibrary-backend:latest .
if %errorlevel% neq 0 (
    echo [ERREUR] Build backend echoue
    pause
    exit /b 1
)
echo [OK] Backend build

echo.
echo 3. VERIFICATION IMAGES:
cd ..
docker images | findstr elibrary

echo.
echo 4. REDEMARRAGE PODS:
kubectl delete pods --all -n elibrary
echo Attente redemarrage...
timeout /t 15 /nobreak >nul

echo.
echo 5. STATUS FINAL:
kubectl get pods -n elibrary

echo.
echo ========================================
echo IMAGES BUILDEES - PODS REDEMARRES
echo ========================================
pause