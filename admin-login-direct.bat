@echo off
echo ========================================
echo CONNEXION ADMIN DIRECTE
echo ========================================

echo.
echo 1. DEMARRAGE FRONTEND UNIQUEMENT:
echo =================================
cd frontend
start /b ng serve --host 0.0.0.0 --port 4200

echo.
echo 2. ATTENTE DEMARRAGE:
echo =====================
timeout /t 10 /nobreak >nul

echo.
echo 3. OUVERTURE NAVIGATEUR:
echo ========================
start http://localhost:4200

echo.
echo ========================================
echo FRONTEND DEMARRE !
echo ========================================
echo URL: http://localhost:4200
echo.
echo CONNEXION ADMIN:
echo - admin / admin
echo - admin@elibrary.com / admin123
echo.
echo (Fonctionne meme sans backend)
echo.
pause