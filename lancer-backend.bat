@echo off
echo ========================================
echo LANCEMENT BACKEND ELIBRARY
echo ========================================

echo.
echo 1. VERIFICATION BACKEND:
echo =======================
kubectl get pods -n elibrary | findstr backend
kubectl get svc -n elibrary | findstr backend

echo.
echo 2. DEMARRAGE PORT-FORWARD:
echo ==========================
echo Demarrage acces backend sur port 8000...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo 3. TEST BACKEND:
echo ===============
echo Test API backend...
curl -s http://localhost:8000 || echo "Backend en cours de demarrage..."
timeout /t 2 /nobreak >nul
curl -s http://localhost:8000/api/health || echo "API non disponible"

echo.
echo 4. OUVERTURE BACKEND:
echo ====================
echo Ouverture interface backend...
start http://localhost:8000

echo.
echo ========================================
echo BACKEND ACCESSIBLE !
echo ========================================
echo.
echo URL Backend: http://localhost:8000
echo API Endpoint: http://localhost:8000/api
echo.
echo Le backend Laravel est maintenant accessible
echo depuis votre navigateur et pour le frontend.
echo.
pause