@echo off
echo ========================================
echo VERIFICATION STRUCTURE PROJET GITHUB
echo ========================================

echo.
echo 1. DOSSIERS REQUIS:
dir /b frontend 2>nul && echo [OK] frontend/ existe || echo [ERREUR] frontend/ manquant
dir /b backend 2>nul && echo [OK] backend/ existe || echo [ERREUR] backend/ manquant
dir /b k8s 2>nul && echo [OK] k8s/ existe || echo [ERREUR] k8s/ manquant
dir /b .github\workflows 2>nul && echo [OK] .github/workflows/ existe || echo [ERREUR] .github/workflows/ manquant

echo.
echo 2. FICHIERS PRINCIPAUX:
dir /b README.md 2>nul && echo [OK] README.md existe || echo [ERREUR] README.md manquant
dir /b docker-compose.yml 2>nul && echo [OK] docker-compose.yml existe || echo [ERREUR] docker-compose.yml manquant

echo.
echo 3. DOCKERFILES:
dir /b frontend\Dockerfile 2>nul && echo [OK] Frontend Dockerfile existe || echo [ERREUR] Frontend Dockerfile manquant
dir /b backend\Dockerfile 2>nul && echo [OK] Backend Dockerfile existe || echo [ERREUR] Backend Dockerfile manquant

echo.
echo 4. MANIFESTS KUBERNETES:
dir /b k8s\namespace.yaml 2>nul && echo [OK] namespace.yaml existe || echo [ERREUR] namespace.yaml manquant
dir /b k8s\simple-mysql.yaml 2>nul && echo [OK] mysql manifest existe || echo [ERREUR] mysql manifest manquant
dir /b k8s\simple-backend.yaml 2>nul && echo [OK] backend manifest existe || echo [ERREUR] backend manifest manquant
dir /b k8s\simple-frontend.yaml 2>nul && echo [OK] frontend manifest existe || echo [ERREUR] frontend manifest manquant

echo.
echo 5. MONITORING:
dir /b k8s\monitoring\prometheus.yaml 2>nul && echo [OK] Prometheus manifest existe || echo [ERREUR] Prometheus manifest manquant
dir /b k8s\monitoring\grafana.yaml 2>nul && echo [OK] Grafana manifest existe || echo [ERREUR] Grafana manifest manquant

echo.
echo 6. PIPELINE CI/CD:
dir /b .github\workflows\simple-ci.yml 2>nul && echo [OK] Pipeline CI/CD existe || echo [ERREUR] Pipeline CI/CD manquant

echo.
echo 7. STRUCTURE COMPLETE:
tree /f /a | findstr /v "node_modules vendor .git"

echo.
echo ========================================
echo VERIFICATION TERMINEE !
echo ========================================
echo.
echo Projet pret pour GitHub !
echo Repository: https://github.com/drabonana2004-cmyk/elibrary-devops
echo.
pause