@echo off
echo ========================================
echo ACTIVATION BACKEND KUBERNETES
echo ========================================

echo.
echo 1. VERIFICATION PODS:
echo =====================
kubectl get pods -n elibrary

echo.
echo 2. PORT-FORWARD BACKEND:
echo ========================
echo Activation port-forward...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo 3. TEST API:
echo ============
curl http://localhost:8000/api/health

echo.
echo ========================================
echo BACKEND K8S ACTIVE !
echo ========================================
echo URL: http://localhost:8000
echo.
pause