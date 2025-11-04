@echo off
echo ========================================
echo DIAGNOSTIC KUBERNETES - ELIBRARY
echo ========================================

echo.
echo 1. STATUS DETAILLE PODS:
kubectl get pods -n elibrary -o wide

echo.
echo 2. DESCRIPTION PODS (erreurs):
kubectl describe pods -n elibrary

echo.
echo 3. EVENTS NAMESPACE:
kubectl get events -n elibrary --sort-by='.lastTimestamp'

echo.
echo 4. VERIFICATION IMAGES DOCKER:
docker images | findstr elibrary

echo.
echo ========================================
echo SOLUTION: BUILD DES IMAGES MANQUANTES
echo ========================================
echo.
pause