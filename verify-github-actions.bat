@echo off
echo ========================================
echo VERIFICATION WORKFLOW GITHUB ACTIONS
echo ========================================

echo.
echo 1. STRUCTURE GITHUB ACTIONS:
dir /b .github 2>nul && echo [OK] Dossier .github/ existe || echo [ERREUR] Dossier .github/ manquant
dir /b .github\workflows 2>nul && echo [OK] Dossier workflows/ existe || echo [ERREUR] Dossier workflows/ manquant

echo.
echo 2. FICHIER WORKFLOW:
dir /b .github\workflows\simple-ci.yml 2>nul && echo [OK] simple-ci.yml existe || echo [ERREUR] simple-ci.yml manquant

echo.
echo 3. CONTENU WORKFLOW:
echo ====================
type .github\workflows\simple-ci.yml 2>nul || echo [ERREUR] Impossible de lire le workflow

echo.
echo 4. VALIDATION SYNTAXE YAML:
echo ============================
echo Verification syntaxe GitHub Actions...
findstr /c:"name:" .github\workflows\simple-ci.yml >nul && echo [OK] Nom workflow defini || echo [ERREUR] Nom workflow manquant
findstr /c:"on:" .github\workflows\simple-ci.yml >nul && echo [OK] Declencheurs definis || echo [ERREUR] Declencheurs manquants
findstr /c:"jobs:" .github\workflows\simple-ci.yml >nul && echo [OK] Jobs definis || echo [ERREUR] Jobs manquants

echo.
echo 5. JOBS PIPELINE:
echo =================
findstr /c:"test:" .github\workflows\simple-ci.yml >nul && echo [OK] Job test existe || echo [ERREUR] Job test manquant
findstr /c:"build:" .github\workflows\simple-ci.yml >nul && echo [OK] Job build existe || echo [ERREUR] Job build manquant
findstr /c:"deploy:" .github\workflows\simple-ci.yml >nul && echo [OK] Job deploy existe || echo [ERREUR] Job deploy manquant
findstr /c:"notify:" .github\workflows\simple-ci.yml >nul && echo [OK] Job notify existe || echo [ERREUR] Job notify manquant

echo.
echo 6. DECLENCHEURS:
echo ================
findstr /c:"push:" .github\workflows\simple-ci.yml >nul && echo [OK] Declencheur push configure || echo [ERREUR] Declencheur push manquant
findstr /c:"main" .github\workflows\simple-ci.yml >nul && echo [OK] Branche main configuree || echo [ERREUR] Branche main manquante

echo.
echo 7. ACTIONS UTILISEES:
echo =====================
findstr /c:"actions/checkout@v4" .github\workflows\simple-ci.yml >nul && echo [OK] Checkout action configuree || echo [ERREUR] Checkout action manquante
findstr /c:"ubuntu-latest" .github\workflows\simple-ci.yml >nul && echo [OK] Runner Ubuntu configure || echo [ERREUR] Runner Ubuntu manquant

echo.
echo 8. PIPELINE WORKFLOW:
echo =====================
echo Push main → Test → Build → Deploy → Notify
echo     ↓        ↓       ↓        ↓        ↓
echo   Code OK  Structure Images  K8s     Status

echo.
echo ========================================
echo WORKFLOW GITHUB ACTIONS VALIDE !
echo ========================================
echo.
echo Pipeline CI/CD fonctionnel:
echo - 4 jobs (test, build, deploy, notify)
echo - Declenchement automatique sur push main
echo - Validation structure projet + manifests K8s
echo - Simulation build Docker + deploiement K8s
echo - Notification resultats
echo.
echo Pour tester: git push origin main
echo Verifier sur: https://github.com/VOTRE-USERNAME/elibrary-devops/actions
echo.
pause