@echo off
echo ========================================
echo    eLibrary DevOps - Tests Rapides
echo ========================================
echo.

cd /d "%~dp0\.."

echo [1/5] Demarrage Docker Compose...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERREUR: Docker Compose a echoue
    pause
    exit /b 1
)

echo.
echo [2/5] Attente du demarrage des services...
timeout /t 15 /nobreak > nul

echo.
echo [3/5] Test des endpoints...

echo Testing Frontend...
curl -f http://localhost:4200/health
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: Frontend non accessible
) else (
    echo ✓ Frontend OK
)

echo.
echo Testing Backend...
curl -f http://localhost:8000/api/health
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: Backend non accessible
) else (
    echo ✓ Backend OK
)

echo.
echo Testing API Stats...
curl -f http://localhost:8000/api/dashboard/stats
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: API Stats non accessible
) else (
    echo ✓ API Stats OK
)

echo.
echo [4/5] Test de la base de donnees...
docker-compose exec -T mysql mysql -u root -psecretpassword -e "SELECT 1 as test;"
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: MySQL non accessible
) else (
    echo ✓ MySQL OK
)

echo.
echo [5/5] Verification des services...
docker-compose ps

echo.
echo ========================================
echo           TESTS TERMINES
echo ========================================
echo.
echo Acces aux services:
echo - Frontend: http://localhost:4200
echo - Backend:  http://localhost:8000/api/health
echo - Grafana:  http://localhost:3000 (admin/admin123)
echo.
echo Pour arreter les services: docker-compose down
echo.
pause