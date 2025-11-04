@echo off
setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: %0 VOTRE-DOCKERHUB-USERNAME
    echo Exemple: %0 johndoe
    pause
    exit /b 1
)

set DOCKER_USERNAME=%1

echo ========================================
echo   Configuration GitHub pour eLibrary
echo ========================================
echo Docker Hub Username: %DOCKER_USERNAME%
echo.

cd /d "%~dp0\.."

echo [1/4] Mise a jour des manifests Kubernetes...
powershell -Command "(Get-Content k8s\backend\backend-deployment.yaml) -replace 'your-dockerhub-username', '%DOCKER_USERNAME%' | Set-Content k8s\backend\backend-deployment.yaml"
powershell -Command "(Get-Content k8s\frontend\frontend-deployment.yaml) -replace 'your-dockerhub-username', '%DOCKER_USERNAME%' | Set-Content k8s\frontend\frontend-deployment.yaml"

echo [2/4] Mise a jour du workflow GitHub Actions...
powershell -Command "(Get-Content .github\workflows\deploy.yml) -replace 'your-dockerhub-username', '%DOCKER_USERNAME%' | Set-Content .github\workflows\deploy.yml"

echo [3/4] Mise a jour de docker-compose.yml...
powershell -Command "(Get-Content docker-compose.yml) -replace 'your-dockerhub-username', '%DOCKER_USERNAME%' | Set-Content docker-compose.yml"

echo [4/4] Configuration terminee!
echo.
echo ========================================
echo         PROCHAINES ETAPES
echo ========================================
echo.
echo 1. Creer un repository GitHub
echo 2. Configurer les secrets GitHub:
echo    - DOCKER_USERNAME=%DOCKER_USERNAME%
echo    - DOCKER_PASSWORD=votre-token-dockerhub
echo    - KUBE_CONFIG=base64-encoded-kubeconfig
echo.
echo 3. Push le code:
echo    git add .
echo    git commit -m "feat: configure CI/CD pipeline"
echo    git push origin main
echo.
pause