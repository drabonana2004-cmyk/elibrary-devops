@echo off
setlocal

rem Simple quick deploy + port-forward to access frontend on localhost:4200
echo ========================================
echo DEPLOIEMENT KUBERNETES RAPIDE
echo ========================================

set NAMESPACE=elibrary
set FRONTEND_SVC=frontend-service
set LOCAL_PORT=4200

echo 1. Verification kubectl...
kubectl version --client >nul 2>&1 || (
	echo [ERREUR] kubectl manquant dans le PATH.
	echo Installez kubectl et configurez votre contexte kubeconfig.
	pause
	exit /b 1
)

echo 2. Nettoyage (namespace)...
kubectl delete namespace %NAMESPACE% --ignore-not-found=true
timeout /t 3 /nobreak >nul

echo 3. Creation namespace...
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -

echo 4. Deploiement des ressources (MySQL, backend, frontend)...
kubectl apply -f k8s/simple-mysql.yaml
kubectl apply -f k8s/simple-backend-working.yaml
kubectl apply -f k8s/simple-frontend-static.yaml

echo 5. Attente courte pour que les pods demarrent (20s)...
timeout /t 20 /nobreak >nul

echo 6. Status des pods dans %NAMESPACE%:
kubectl get pods -n %NAMESPACE%

echo.
echo 7. Verification du service %FRONTEND_SVC%...
for /f "delims=" %%p in ('kubectl get svc %FRONTEND_SVC% -n %NAMESPACE% -o jsonpath^="{.spec.ports[0].port}" 2^>nul') do set SVC_PORT=%%p

if "%SVC_PORT%"=="" (
	echo [ERREUR] le service %FRONTEND_SVC% est introuvable dans le namespace %NAMESPACE%.
	echo Liste des services disponibles:
	kubectl get svc -n %NAMESPACE%
	pause
	endlocal
	exit /b 1
)

echo Service trouve: %FRONTEND_SVC% port: %SVC_PORT%

echo 8. Lancement du port-forward dans une nouvelle fenetre (local %LOCAL_PORT% -> remote %SVC_PORT%)...
start "k8s-frontend-pf" cmd /k "kubectl port-forward svc/%FRONTEND_SVC% %LOCAL_PORT%:%SVC_PORT% -n %NAMESPACE%"

rem petit delai pour que le port-forward demarre
timeout /t 2 >nul

echo 9. Ouverture du navigateur sur http://localhost:%LOCAL_PORT% ...
start "" "http://localhost:%LOCAL_PORT%/"

echo.
echo Pour arreter le port-forward, fermez la fenetre 'k8s-frontend-pf'.
pause
endlocal