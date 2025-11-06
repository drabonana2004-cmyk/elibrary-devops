@echo off
echo ========================================
echo ACCES VRAI FRONTEND ANGULAR KUBERNETES
echo ========================================

echo.
echo FERMETURE PAGE HTML STATIQUE...
echo ===============================
taskkill /f /im chrome.exe 2>nul
taskkill /f /im msedge.exe 2>nul
taskkill /f /im firefox.exe 2>nul

echo.
echo ACCES FRONTEND ANGULAR REEL:
echo ============================
echo Demarrage port-forward frontend...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
timeout /t 3 /nobreak >nul

echo Demarrage port-forward backend...
start /b kubectl port-forward svc/backend-service 8000:8000 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo OUVERTURE VRAIE APPLICATION:
echo ============================
echo Ouverture frontend Angular reel...
start http://localhost:4200

echo.
echo ========================================
echo FRONTEND ANGULAR KUBERNETES ACTIF !
echo ========================================
echo.
echo Votre VRAIE application eLibrary:
echo Frontend Angular: http://localhost:4200
echo Backend Laravel: http://localhost:8000
echo.
echo Maintenant vous pouvez tester la connexion
echo avec admin@gmail.com / admin123 sur la
echo VRAIE page de connexion Angular !
echo.
pause