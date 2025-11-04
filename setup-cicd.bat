@echo off
echo ========================================
echo CONFIGURATION PIPELINE CI/CD
echo ========================================

echo.
echo 1. VERIFICATION FICHIERS:
dir /b .github\workflows\ci-cd.yml 2>nul && echo [OK] Pipeline CI/CD existe || echo [ERREUR] Pipeline manquant
dir /b frontend\Dockerfile 2>nul && echo [OK] Frontend Dockerfile existe || echo [ERREUR] Frontend Dockerfile manquant
dir /b backend\Dockerfile 2>nul && echo [OK] Backend Dockerfile existe || echo [ERREUR] Backend Dockerfile manquant

echo.
echo 2. SECRETS GITHUB REQUIS:
echo.
echo Allez sur GitHub: https://github.com/VOTRE-USERNAME/elibrary-devops/settings/secrets/actions
echo.
echo Ajoutez ces secrets:
echo - DOCKER_USERNAME: votre nom d'utilisateur Docker Hub
echo - DOCKER_PASSWORD: votre token Docker Hub
echo - KUBE_CONFIG: votre configuration Kubernetes en base64
echo.

echo 3. COMMANDES POUR OBTENIR KUBE_CONFIG:
echo.
echo # Windows:
echo certlm.exe -exportPFX -user My CERTIFICAT_NAME cert.pfx
echo.
echo # Ou copier depuis Docker Desktop:
echo type %USERPROFILE%\.kube\config ^| base64 -w 0
echo.

echo 4. TESTER LE PIPELINE:
echo.
echo git add .
echo git commit -m "feat: add CI/CD pipeline"
echo git push origin main
echo.

echo ========================================
echo PIPELINE CI/CD CONFIGURE !
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Configurer les secrets GitHub
echo 2. Pousser le code
echo 3. Verifier l'execution sur GitHub Actions
echo.
pause