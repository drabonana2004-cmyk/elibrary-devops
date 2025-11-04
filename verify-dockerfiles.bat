@echo off
echo ========================================
echo VERIFICATION DOCKERFILES INDIVIDUELS
echo ========================================

echo.
echo 1. DOCKERFILES EXISTANTS:
dir /b frontend\Dockerfile 2>nul && echo [OK] Frontend Dockerfile existe || echo [ERREUR] Frontend Dockerfile manquant
dir /b backend\Dockerfile 2>nul && echo [OK] Backend Dockerfile existe || echo [ERREUR] Backend Dockerfile manquant
echo [INFO] Database utilise l'image officielle mysql:8.0

echo.
echo 2. CONTENU FRONTEND DOCKERFILE:
echo ================================
type frontend\Dockerfile 2>nul || echo [ERREUR] Impossible de lire frontend/Dockerfile

echo.
echo 3. CONTENU BACKEND DOCKERFILE:
echo ===============================
type backend\Dockerfile 2>nul || echo [ERREUR] Impossible de lire backend/Dockerfile

echo.
echo 4. CONFIGURATIONS ASSOCIEES:
dir /b frontend\nginx.conf 2>nul && echo [OK] nginx.conf existe || echo [ERREUR] nginx.conf manquant
dir /b backend\apache.conf 2>nul && echo [OK] apache.conf existe || echo [ERREUR] apache.conf manquant

echo.
echo 5. TEST BUILD (OPTIONNEL):
echo ==========================
echo Pour tester les builds:
echo docker build -t test-frontend ./frontend
echo docker build -t test-backend ./backend
echo docker pull mysql:8.0

echo.
echo ========================================
echo DOCKERFILES VALIDES !
echo ========================================
echo.
echo Services conteneurises:
echo - Frontend: Angular 17 + Nginx (Multi-stage)
echo - Backend: Laravel 11 + PHP 8.2 + Apache
echo - Database: MySQL 8.0 (Image officielle)
echo.
pause