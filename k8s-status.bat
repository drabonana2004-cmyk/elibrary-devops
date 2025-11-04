@echo off
echo ========================================
echo STATUS KUBERNETES - ELIBRARY
echo ========================================

echo.
echo 1. STATUS PODS:
kubectl get pods -n elibrary

echo.
echo 2. STATUS SERVICES:
kubectl get svc -n elibrary

echo.
echo 3. LOGS MYSQL (si erreur):
kubectl logs -l app=mysql -n elibrary --tail=10

echo.
echo 4. LOGS BACKEND (si erreur):
kubectl logs -l app=backend -n elibrary --tail=10

echo.
echo 5. LOGS FRONTEND (si erreur):
kubectl logs -l app=frontend -n elibrary --tail=10

echo.
echo 6. DESCRIPTION PODS (si probleme):
kubectl describe pods -n elibrary

echo.
echo ========================================
echo Pour acceder a l'application:
echo ========================================
echo Frontend: kubectl port-forward svc/frontend-service 4200:80 -n elibrary
echo Backend:  kubectl port-forward svc/backend-service 8000:8000 -n elibrary
echo.
pause