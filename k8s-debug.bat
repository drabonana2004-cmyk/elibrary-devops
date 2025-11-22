@echo off
setlocal

rem ====================
rem ELIBRARY K8S TOOL
rem - diagnostics
rem - open application via kubectl port-forward
rem ====================

set NAMESPACE=elibrary
set DEFAULT_SERVICE=elibrary-service
set LOCAL_PORT=8080

echo ========================================
echo DIAGNOSTIC KUBERNETES - ELIBRARY
echo ========================================
echo.
echo Choix:
echo  1) Lancer les diagnostics (pods/events/images)
echo  2) Ouvrir l application via port-forward -> http://localhost:%LOCAL_PORT%
echo  3) Quitter
echo.
set /p CHOICE=Selection [1/2/3] :

if "%CHOICE%"=="1" goto diagnostics
if "%CHOICE%"=="2" goto openapp
if "%CHOICE%"=="3" goto end

echo Choix invalide.
pause
goto end

:diagnostics
echo.
echo 1. STATUS DETAILLE PODS:
kubectl get pods -n %NAMESPACE% -o wide

echo.
echo 2. DESCRIPTION PODS (erreurs):
kubectl describe pods -n %NAMESPACE%

echo.
echo 3. EVENTS NAMESPACE:
kubectl get events -n %NAMESPACE% --sort-by='.lastTimestamp'

echo.
echo 4. VERIFICATION IMAGES DOCKER:
docker images | findstr %NAMESPACE%

echo.
echo ========================================
echo SOLUTION: BUILD DES IMAGES MANQUANTES
echo ========================================
echo.
pause
goto end

:openapp
echo.
echo OUVERTURE DE L'APPLICATION DANS LE NAMESPACE %NAMESPACE%
echo Nom du service a utiliser (par defaut: %DEFAULT_SERVICE%):
set /p SERVICE=Nom du service [%DEFAULT_SERVICE%] :
if "%SERVICE%"=="" set SERVICE=%DEFAULT_SERVICE%

echo Recherche du port du service %SERVICE%...
set "SVC_PORT="
for /f "delims=" %%p in ('kubectl get svc %SERVICE% -n %NAMESPACE% -o jsonpath^="{.spec.ports[0].port}" 2^>nul') do set SVC_PORT=%%p

if "%SVC_PORT%"=="" (
	echo ERREUR: service "%SERVICE%" introuvable ou aucun port detecte dans le namespace %NAMESPACE%.
	echo Liste des services disponibles:
	kubectl get svc -n %NAMESPACE%
	pause
	goto end
)

echo Service trouve: %SERVICE% port: %SVC_PORT%
echo Lancement d'un port-forward local %LOCAL_PORT%:%SVC_PORT% (nouvelle fenetre)...
start "k8s-port-forward" cmd /k "kubectl port-forward svc/%SERVICE% %LOCAL_PORT%:%SVC_PORT% -n %NAMESPACE%"

rem attendre un peu que le port-forward demarre
timeout /t 2 >nul

echo Ouverture du navigateur sur http://localhost:%LOCAL_PORT% ...
start "" "http://localhost:%LOCAL_PORT%/"

echo Pour arreter le port-forward, fermez la fenetre 'k8s-port-forward'.
echo.
pause
goto end

:end
endlocal