@echo off
echo ========================================
echo TEST KUBERNETES ELIBRARY
echo ========================================

echo.
echo 1. STATUS PODS:
kubectl get pods -n elibrary

echo.
echo 2. STATUS SERVICES:
kubectl get services -n elibrary

echo.
echo 3. TEST BACKEND:
echo Demarrage port-forward backend...
start /B kubectl port-forward svc/backend-service 8080:80 -n elibrary
timeout /t 3 /nobreak >nul

echo Test endpoint backend...
curl -s http://localhost:8080/test 2>nul || echo Backend non accessible

echo.
echo 4. TEST FRONTEND:
echo Demarrage port-forward frontend...
start /B kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul

echo Frontend accessible sur: http://localhost:4200

echo.
echo 5. LOGS PODS (dernières lignes):
for /f "tokens=1" %%i in ('kubectl get pods -n elibrary --no-headers -o custom-columns=":metadata.name"') do (
    echo.
    echo === LOGS %%i ===
    kubectl logs %%i -n elibrary --tail=3 2>nul
)

echo.
echo ========================================
echo TEST TERMINE
echo ========================================
echo.
echo Applications accessibles:
echo - Frontend: http://localhost:4200
echo - Backend: http://localhost:8080/test
echo.
pause