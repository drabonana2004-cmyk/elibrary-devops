@echo off
echo ========================================
echo ACCES FRONTEND ELIBRARY
echo ========================================

echo.
echo 1. VERIFICATION FRONTEND:
echo ========================
kubectl get pods -n elibrary | findstr frontend
kubectl get svc -n elibrary | findstr frontend

echo.
echo 2. PORT-FORWARD FRONTEND:
echo ========================
echo Demarrage port-forward...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo 3. OUVERTURE FRONTEND:
echo =====================
echo Ouverture de l'application eLibrary...
start http://localhost:4200

echo.
echo ========================================
echo FRONTEND ACCESSIBLE !
echo ========================================
echo.
echo URL: http://localhost:4200
echo.
echo Si la page ne charge pas:
echo 1. Verifiez que le pod frontend est Running
echo 2. Attendez quelques secondes
echo 3. Rafraichissez la page
echo.
pause