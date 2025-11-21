@echo off
echo ========================================
echo DIAGNOSTIC ET REPARATION KUBERNETES
echo ========================================

echo 1. Status Docker Desktop...
docker version >nul 2>&1 && echo [OK] Docker fonctionne || echo [ERREUR] Docker arrete

echo 2. Status Kubernetes...
kubectl cluster-info >nul 2>&1 && echo [OK] Kubernetes accessible || echo [ERREUR] Kubernetes inaccessible

echo 3. Nettoyage complet...
kubectl delete namespace elibrary --ignore-not-found=true
timeout /t 10 /nobreak >nul

echo 4. Reset Kubernetes (si necessaire)...
docker system prune -f
kubectl delete all --all -n default

echo 5. Recreation namespace...
kubectl create namespace elibrary

echo 6. Deploiement MySQL simple...
kubectl run mysql --image=mysql:8.0 --env="MYSQL_ROOT_PASSWORD=secretpassword" --env="MYSQL_DATABASE=elibrary" -n elibrary
kubectl expose pod mysql --port=3306 --name=mysql-service -n elibrary

echo 7. Test MySQL...
timeout /t 15 /nobreak >nul
kubectl get pods -n elibrary

echo 8. Deploiement Frontend simple...
kubectl run frontend --image=nginx:alpine -n elibrary
kubectl expose pod frontend --port=80 --name=frontend-service --type=LoadBalancer -n elibrary

echo 9. Status final...
kubectl get all -n elibrary

echo.
echo ACCES:
echo kubectl port-forward pod/frontend 4200:80 -n elibrary
echo Puis: http://localhost:4200
pause