@echo off
echo ========================================
echo DEMARRAGE KUBERNETES
echo ========================================

echo.
echo Tentative de demarrage avec Docker Desktop...
kubectl cluster-info 2>nul
if %errorlevel% == 0 (
    echo [OK] Kubernetes deja actif !
    goto deploy
)

echo.
echo Tentative avec minikube...
minikube status 2>nul
if %errorlevel% == 0 (
    echo [OK] Minikube actif !
    goto deploy
) else (
    echo Demarrage minikube...
    minikube start
    if %errorlevel% == 0 goto deploy
)

echo.
echo Tentative avec kind...
kind get clusters 2>nul | findstr elibrary >nul
if %errorlevel% == 0 (
    echo [OK] Kind cluster actif !
    goto deploy
) else (
    echo Creation cluster kind...
    kind create cluster --name elibrary
    if %errorlevel% == 0 goto deploy
)

echo.
echo [ERREUR] Impossible de demarrer Kubernetes
echo Veuillez activer Kubernetes dans Docker Desktop
pause
exit /b 1

:deploy
echo.
echo ========================================
echo KUBERNETES PRET - DEPLOIEMENT
echo ========================================
kubectl cluster-info
echo.
echo Lancer maintenant: .\k8s-deploy.bat
pause