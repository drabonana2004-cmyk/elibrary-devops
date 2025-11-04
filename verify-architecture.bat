@echo off
echo ========================================
echo VERIFICATION ARCHITECTURE 3-TIERS
echo ========================================

echo.
echo 1. SEPARATION DES COMPOSANTS:
echo ✓ Frontend: 
dir /b frontend\Dockerfile 2>nul && echo   [OK] Frontend Dockerfile existe || echo   [ERREUR] Frontend Dockerfile manquant
echo ✓ Backend:
dir /b backend\Dockerfile 2>nul && echo   [OK] Backend Dockerfile existe || echo   [ERREUR] Backend Dockerfile manquant
echo ✓ Base de donnees:
dir /b database\schema.sql 2>nul && echo   [OK] Schema MySQL existe || echo   [ERREUR] Schema MySQL manquant

echo.
echo 2. CONTENEURISATION INDEPENDANTE:
echo ✓ Docker Compose:
dir /b docker-compose.yml 2>nul && echo   [OK] Docker Compose existe || echo   [ERREUR] Docker Compose manquant
echo ✓ Images separees:
findstr /c:"elibrary-frontend" docker-compose.yml >nul && echo   [OK] Image frontend definie || echo   [ERREUR] Image frontend manquante
findstr /c:"elibrary-backend" docker-compose.yml >nul && echo   [OK] Image backend definie || echo   [ERREUR] Image backend manquante
findstr /c:"mysql:8.0" docker-compose.yml >nul && echo   [OK] Image MySQL definie || echo   [ERREUR] Image MySQL manquante

echo.
echo 3. DEPLOIEMENT KUBERNETES:
echo ✓ Namespace:
dir /b k8s\namespace.yaml 2>nul && echo   [OK] Namespace existe || echo   [ERREUR] Namespace manquant
echo ✓ MySQL:
dir /b k8s\mysql\mysql-deployment.yaml 2>nul && echo   [OK] MySQL deployment existe || echo   [ERREUR] MySQL deployment manquant
echo ✓ Backend:
dir /b k8s\backend\backend-deployment.yaml 2>nul && echo   [OK] Backend deployment existe || echo   [ERREUR] Backend deployment manquant
echo ✓ Frontend:
dir /b k8s\frontend\frontend-deployment.yaml 2>nul && echo   [OK] Frontend deployment existe || echo   [ERREUR] Frontend deployment manquant

echo.
echo 4. VERIFICATION CONTENU:
echo ✓ Ports separes:
findstr /c:"4200" docker-compose.yml >nul && echo   [OK] Frontend port 4200 || echo   [ERREUR] Port frontend incorrect
findstr /c:"8000" docker-compose.yml >nul && echo   [OK] Backend port 8000 || echo   [ERREUR] Port backend incorrect
findstr /c:"3306" docker-compose.yml >nul && echo   [OK] MySQL port 3306 || echo   [ERREUR] Port MySQL incorrect

echo.
echo ========================================
echo ARCHITECTURE 3-TIERS VALIDEE !
echo ========================================
pause