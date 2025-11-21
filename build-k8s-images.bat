@echo off
echo ========================================
echo BUILD IMAGES DOCKER POUR KUBERNETES
echo ========================================

echo.
echo 1. BUILD BACKEND IMAGE:
cd backend
docker build -t elibrary-backend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Build backend echoue
    pause
    exit /b 1
)
echo [OK] Backend image construite
cd ..

echo.
echo 2. BUILD FRONTEND IMAGE:
cd frontend
docker build -t elibrary-frontend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Build frontend echoue
    pause
    exit /b 1
)
echo [OK] Frontend image construite
cd ..

echo.
echo 3. VERIFICATION IMAGES:
docker images | findstr elibrary

echo.
echo ========================================
echo BUILD TERMINE !
echo ========================================
pause