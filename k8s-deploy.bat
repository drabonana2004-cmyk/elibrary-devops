@echo off
echo ========================================
echo DEPLOIEMENT KUBERNETES - ELIBRARY
echo ========================================

echo.
echo 1. VERIFICATION KUBERNETES:
kubectl version --client 2>nul && echo [OK] kubectl installe || echo [ERREUR] kubectl manquant
kubectl cluster-info 2>nul && echo [OK] Cluster accessible || echo [ERREUR] Cluster inaccessible

echo.
echo 2. DEPLOIEMENT NAMESPACE:
kubectl apply -f k8s/namespace.yaml
kubectl get namespace elibrary

echo.
echo 3. DEPLOIEMENT MYSQL:
kubectl apply -f k8s/mysql/mysql-deployment.yaml
echo Attente MySQL...
timeout /t 10 /nobreak >nul

echo.
echo 4. DEPLOIEMENT BACKEND:
kubectl apply -f k8s/backend/backend-deployment.yaml
echo Attente Backend...
timeout /t 10 /nobreak >nul

echo.
echo 5. DEPLOIEMENT FRONTEND:
kubectl apply -f k8s/frontend/frontend-deployment.yaml
echo Attente Frontend...
timeout /t 10 /nobreak >nul

echo.
echo 6. VERIFICATION DEPLOIEMENT:
kubectl get all -n elibrary

echo.
echo 7. STATUS PODS:
kubectl get pods -n elibrary -o wide

echo.
echo ========================================
echo DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Acces application:
echo - Frontend: kubectl port-forward svc/frontend-service 4200:80 -n elibrary
echo - Backend: kubectl port-forward svc/backend-service 8000:8000 -n elibrary
echo.
pause