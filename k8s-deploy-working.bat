@echo off
echo ========================================
echo DEPLOIEMENT KUBERNETES FONCTIONNEL
echo ========================================

echo.
echo 1. VERIFICATION KUBERNETES:
kubectl version --client 2>nul || (echo [ERREUR] kubectl manquant && pause && exit /b 1)
kubectl cluster-info 2>nul || (echo [ERREUR] Cluster inaccessible && pause && exit /b 1)
echo [OK] Kubernetes pret

echo.
echo 2. NETTOYAGE:
kubectl delete namespace elibrary --ignore-not-found=true
echo Attente suppression...
timeout /t 5 /nobreak >nul

echo.
echo 3. CREATION NAMESPACE:
kubectl apply -f k8s/namespace.yaml
echo [OK] Namespace cree

echo.
echo 4. DEPLOIEMENT MYSQL:
kubectl apply -f k8s/simple-mysql.yaml
echo Attente MySQL...
timeout /t 15 /nobreak >nul

echo.
echo 5. DEPLOIEMENT BACKEND:
kubectl apply -f k8s/simple-backend-working.yaml
echo Attente Backend...
timeout /t 10 /nobreak >nul

echo.
echo 6. DEPLOIEMENT FRONTEND:
kubectl apply -f k8s/simple-frontend-static.yaml
echo Attente Frontend...
timeout /t 10 /nobreak >nul

echo.
echo 7. VERIFICATION:
kubectl get pods -n elibrary

echo.
echo 8. ATTENTE PODS READY:
echo Verification status pods...
:wait_loop
kubectl get pods -n elibrary --no-headers | findstr -v "Running" | findstr -v "Completed" >nul
if %ERRORLEVEL% EQU 0 (
    echo Pods en cours de demarrage...
    timeout /t 5 /nobreak >nul
    goto wait_loop
)

echo.
echo 9. STATUS FINAL:
kubectl get all -n elibrary

echo.
echo ========================================
echo DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo ACCES APPLICATION:
echo.
echo Dans un nouveau terminal, executez:
echo kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
echo.
echo Puis ouvrez: http://localhost:4200
echo.
echo TESTS:
echo - Backend: kubectl port-forward svc/backend-service 8080:80 -n elibrary
echo - Puis: http://localhost:8080/test
echo.
pause