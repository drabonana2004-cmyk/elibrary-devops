@echo off
echo ========================================
echo DEPLOIEMENT KUBERNETES SIMPLE - ELIBRARY
echo ========================================

echo.
echo 0. BUILD IMAGES:
call build-k8s-images.bat
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Build images echoue
    pause
    exit /b 1
)

echo.
echo 1. VERIFICATION KUBERNETES:
kubectl version --client 2>nul && echo [OK] kubectl installe || (echo [ERREUR] kubectl manquant && pause && exit /b 1)
kubectl cluster-info 2>nul && echo [OK] Cluster accessible || (echo [ERREUR] Cluster inaccessible && pause && exit /b 1)

echo.
echo 2. NETTOYAGE PRECEDENT:
kubectl delete namespace elibrary --ignore-not-found=true
echo Attente suppression...
timeout /t 10 /nobreak >nul

echo.
echo 3. DEPLOIEMENT NAMESPACE:
kubectl apply -f k8s/namespace.yaml
kubectl get namespace elibrary

echo.
echo 4. DEPLOIEMENT MYSQL:
kubectl apply -f k8s/simple-mysql.yaml
echo Attente MySQL...
timeout /t 20 /nobreak >nul

echo.
echo 5. DEPLOIEMENT BACKEND:
kubectl apply -f k8s/simple-backend.yaml
echo Attente Backend...
timeout /t 15 /nobreak >nul

echo.
echo 6. DEPLOIEMENT FRONTEND:
kubectl apply -f k8s/simple-frontend.yaml
echo Attente Frontend...
timeout /t 15 /nobreak >nul

echo.
echo 7. VERIFICATION DEPLOIEMENT:
kubectl get all -n elibrary

echo.
echo 8. STATUS PODS:
kubectl get pods -n elibrary -o wide

echo.
echo 9. LOGS (si erreurs):
for /f "tokens=1" %%i in ('kubectl get pods -n elibrary --no-headers -o custom-columns=":metadata.name"') do (
    echo.
    echo === LOGS POD %%i ===
    kubectl logs %%i -n elibrary --tail=5
)

echo.
echo ========================================
echo DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Pour acceder a l'application:
echo 1. Frontend: kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
echo 2. Backend: kubectl port-forward svc/backend-service 8000:80 -n elibrary
echo.
echo Pour debug:
echo - kubectl get pods -n elibrary
echo - kubectl logs [pod-name] -n elibrary
echo - kubectl describe pod [pod-name] -n elibrary
echo.
pause