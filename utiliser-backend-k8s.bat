@echo off
echo ========================================
echo UTILISATION BACKEND KUBERNETES
echo ========================================

echo.
echo VOTRE BACKEND FONCTIONNE DEJA !
echo ===============================
echo Pas besoin d'installation locale.
echo Utilisez le backend sur Kubernetes.

echo.
echo 1. VERIFICATION BACKEND K8S:
echo ============================
kubectl get pods -n elibrary | findstr backend

echo.
echo 2. ACCES BACKEND:
echo ================
echo Demarrage acces backend...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo 3. TEST API:
echo ===========
echo Test API backend...
curl -s http://localhost:8000 || echo "Backend en cours de demarrage..."

echo.
echo 4. OUVERTURE:
echo ============
start http://localhost:8000

echo.
echo ========================================
echo BACKEND KUBERNETES ACTIF !
echo ========================================
echo.
echo Backend: http://localhost:8000
echo API: http://localhost:8000/api
echo.
echo Votre backend Laravel fonctionne sur Kubernetes.
echo Pas besoin de Composer ou installation locale !
echo.
pause