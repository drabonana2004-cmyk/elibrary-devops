@echo off
echo ========================================
echo REDEMARRAGE FRONTEND AVEC CORRECTIONS
echo ========================================

echo.
echo 1. ARRET PROCESSUS EXISTANTS:
echo =============================
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo.
echo 2. NETTOYAGE CACHE ANGULAR:
echo ===========================
cd /d "c:\Users\drabo\Documents\elibrary\frontend"
if exist ".angular\cache" (
    rmdir /s /q ".angular\cache"
    echo Cache supprime
)

echo.
echo 3. DEMARRAGE FRONTEND:
echo =====================
echo Demarrage sur port 4201...
start /b npx ng serve --port 4201

echo.
echo 4. ATTENTE COMPILATION:
echo ======================
echo Compilation en cours (20 secondes)...
timeout /t 20 /nobreak >nul

echo.
echo 5. OUVERTURE NAVIGATEUR:
echo =======================
start http://localhost:4201

echo.
echo ========================================
echo FRONTEND REDÉMARRE AVEC CORRECTIONS !
echo ========================================
echo.
echo IDENTIFIANTS ADMIN:
echo Email: admin@gmail.com  
echo Mot de passe: admin123
echo.
echo Le bouton de connexion devrait maintenant fonctionner.
echo Ouvrez F12 pour voir les logs de debug.
echo.
pause