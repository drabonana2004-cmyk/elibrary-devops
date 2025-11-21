@echo off
echo ========================================
echo VERIFICATION DEPLOIEMENT KUBERNETES
echo ========================================

echo.
echo 1. NAMESPACE:
kubectl get namespace elibrary 2>nul && echo [OK] Namespace existe || echo [ERREUR] Namespace manquant

echo.
echo 2. PODS STATUS:
kubectl get pods -n elibrary
echo.

echo 3. PODS READY CHECK:
for /f "tokens=2,3" %%a in ('kubectl get pods -n elibrary --no-headers') do (
    if "%%a"=="Running" (
        echo [OK] Pod %%b en cours d'execution
    ) else (
        echo [ERREUR] Pod %%b status: %%a
    )
)

echo.
echo 4. SERVICES:
kubectl get services -n elibrary

echo.
echo 5. TEST CONNECTIVITE:
echo Test MySQL...
kubectl exec -n elibrary deployment/mysql -- mysqladmin ping -h localhost -u root -psecretpassword 2>nul && echo [OK] MySQL accessible || echo [ERREUR] MySQL inaccessible

echo.
echo 6. RESUME:
set /a total_pods=0
set /a running_pods=0
for /f %%i in ('kubectl get pods -n elibrary --no-headers ^| find /c /v ""') do set /a total_pods=%%i
for /f %%i in ('kubectl get pods -n elibrary --no-headers ^| find "Running" ^| find /c /v ""') do set /a running_pods=%%i

echo Total pods: %total_pods%
echo Pods running: %running_pods%

if %running_pods%==%total_pods% (
    echo.
    echo [SUCCESS] Deploiement OK - Tous les pods fonctionnent
    echo.
    echo ACCES APPLICATION:
    echo 1. kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
    echo 2. Ouvrir http://localhost:4200
) else (
    echo.
    echo [ERREUR] Deploiement incomplet
    echo.
    echo DIAGNOSTIC:
    kubectl get events -n elibrary --sort-by='.lastTimestamp' | tail -5
)

echo.
pause