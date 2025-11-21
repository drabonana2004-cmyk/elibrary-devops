@echo off
echo ========================================
echo VERIFICATION DEPLOIEMENT KUBERNETES
echo ========================================

echo 1. NAMESPACE:
kubectl get namespace elibrary 2>nul && echo [OK] Namespace existe || echo [ERREUR] Namespace manquant

echo.
echo 2. PODS STATUS:
kubectl get pods -n elibrary
echo.

echo 3. SERVICES:
kubectl get services -n elibrary
echo.

echo 4. PODS DETAILS:
for /f "tokens=1" %%i in ('kubectl get pods -n elibrary --no-headers -o custom-columns=":metadata.name" 2^>nul') do (
    echo === POD %%i ===
    kubectl get pod %%i -n elibrary -o wide
    echo Status: 
    kubectl get pod %%i -n elibrary -o jsonpath="{.status.phase}"
    echo.
    echo Logs recents:
    kubectl logs %%i -n elibrary --tail=3 2>nul
    echo.
)

echo 5. TEST CONNECTIVITE:
echo Test MySQL...
kubectl exec -n elibrary deployment/mysql -- mysqladmin ping -h localhost -u root -psecretpassword 2>nul && echo [OK] MySQL accessible || echo [ERREUR] MySQL inaccessible

echo.
echo 6. RESUME:
set /a running_pods=0
for /f %%i in ('kubectl get pods -n elibrary --no-headers 2^>nul ^| find "Running" ^| find /c /v ""') do set /a running_pods=%%i

if %running_pods% GTR 0 (
    echo [SUCCESS] %running_pods% pods en cours d'execution
    echo.
    echo POUR ACCEDER:
    echo kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
    echo Puis ouvrir: http://localhost:4200
) else (
    echo [ERREUR] Aucun pod en cours d'execution
    echo.
    echo DIAGNOSTIC:
    kubectl get events -n elibrary --sort-by='.lastTimestamp' 2>nul | tail -5
)

echo.
pause