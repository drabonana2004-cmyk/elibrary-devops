@echo off
echo ========================================
echo PREPARATION DEMONSTRATION ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE SERVICES:
echo =====================
echo Verification pods Kubernetes...
kubectl get pods -n elibrary

echo.
echo Demarrage port-forward...
start /b kubectl port-forward svc/frontend-service 4200:4200 -n elibrary
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
start /b kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary

timeout /t 5 /nobreak >nul

echo.
echo 2. OUVERTURE ONGLETS DEMO:
echo ==========================
echo Application eLibrary...
start http://localhost:4200

echo Dashboard Grafana...
start http://localhost:3000

echo Prometheus...
start http://localhost:9090

echo GitHub Actions...
start https://github.com/[username]/elibrary-devops/actions

echo.
echo 3. COMMANDES DEMO KUBERNETES:
echo ============================
echo kubectl get all -n elibrary
echo kubectl describe pod [pod-name] -n elibrary
echo kubectl logs -l app=frontend -n elibrary

echo.
echo 4. POINTS CLES DEMONSTRATION:
echo ============================
echo ✅ Tous les pods Running
echo ✅ Application accessible (port 4200)
echo ✅ Grafana dashboard fonctionnel
echo ✅ Metriques Prometheus actives
echo ✅ Pipeline GitHub Actions reussi

echo.
echo ========================================
echo DEMONSTRATION PRETE !
echo ========================================
echo.
echo Onglets ouverts:
echo - Frontend: http://localhost:4200
echo - Grafana: http://localhost:3000 (admin/admin123)
echo - Prometheus: http://localhost:9090
echo - GitHub: Actions pipeline
echo.
pause