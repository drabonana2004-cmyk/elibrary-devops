@echo off
echo ========================================
echo FORCE VRAIE APPLICATION ANGULAR
echo ========================================

echo.
echo 1. SUPPRESSION COMPLETE:
echo ========================
kubectl delete deployment frontend -n elibrary
kubectl delete service frontend-service -n elibrary
kubectl delete configmap frontend-html -n elibrary 2>nul
timeout /t 5 /nobreak >nul

echo.
echo 2. BUILD FORCE IMAGE:
echo ====================
cd frontend
docker build --no-cache -t elibrary-frontend:latest .
cd ..

echo.
echo 3. REDEPLOY COMPLET:
echo ===================
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo 4. FORCE RESTART POD:
echo ====================
timeout /t 10 /nobreak >nul
kubectl delete pod -l app=frontend -n elibrary
timeout /t 10 /nobreak >nul

echo.
echo 5. NOUVEAU PORT-FORWARD:
echo ========================
taskkill /f /im kubectl.exe 2>nul
timeout /t 3 /nobreak >nul
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary

echo.
echo 6. TEST:
echo =======
timeout /t 8 /nobreak >nul
start http://localhost:4200

echo.
echo ========================================
echo DONE! Votre page de connexion Angular
echo devrait maintenant apparaitre !
echo ========================================
pause