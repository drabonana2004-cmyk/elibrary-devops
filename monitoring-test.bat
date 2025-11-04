@echo off
echo ========================================
echo TEST MONITORING ELIBRARY
echo ========================================

echo.
echo 1. VERIFICATION PODS MONITORING:
kubectl get pods -n elibrary -l app=prometheus
kubectl get pods -n elibrary -l app=grafana

echo.
echo 2. ACCES PROMETHEUS:
echo Demarrage port-forward Prometheus...
start /b kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary
timeout /t 5 /nobreak >nul

echo.
echo 3. ACCES GRAFANA:
echo Demarrage port-forward Grafana...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 5 /nobreak >nul

echo.
echo 4. TEST CONNECTIVITE:
echo Test Prometheus...
curl -s http://localhost:9090/api/v1/query?query=up | findstr "success" >nul && echo [OK] Prometheus accessible || echo [ERREUR] Prometheus inaccessible

echo Test Grafana...
curl -s http://localhost:3000/api/health | findstr "ok" >nul && echo [OK] Grafana accessible || echo [ERREUR] Grafana inaccessible

echo.
echo ========================================
echo MONITORING PRET !
echo ========================================
echo.
echo Interfaces disponibles:
echo - Prometheus: http://localhost:9090
echo - Grafana: http://localhost:3000 (admin/admin123)
echo.
echo Dashboard eLibrary: http://localhost:3000/d/elibrary
echo.
pause