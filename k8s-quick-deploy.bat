@echo off
echo ========================================
echo DEPLOIEMENT KUBERNETES RAPIDE
echo ========================================

echo 1. Verification Kubernetes...
kubectl version --client >nul 2>&1 || (echo [ERREUR] kubectl manquant && pause && exit /b 1)

echo 2. Nettoyage...
kubectl delete namespace elibrary --ignore-not-found=true
timeout /t 5 /nobreak >nul

echo 3. Creation namespace...
kubectl create namespace elibrary

echo 4. Deploiement MySQL...
kubectl apply -f k8s/simple-mysql.yaml

echo 5. Deploiement Backend...
kubectl apply -f k8s/simple-backend-working.yaml

echo 6. Deploiement Frontend...
kubectl apply -f k8s/simple-frontend-static.yaml

echo 7. Attente pods...
timeout /t 20 /nobreak >nul

echo 8. Status:
kubectl get pods -n elibrary

echo.
echo ACCES APPLICATION:
echo kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
echo Puis: http://localhost:4200
pause