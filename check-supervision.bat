@echo off
echo ========================================
echo VERIFICATION SUPERVISION ELIBRARY
echo ========================================

echo.
echo 1. STATUS PODS:
echo ==============
kubectl get pods -n elibrary -o wide

echo.
echo 2. STATUS SERVICES:
echo ==================
kubectl get svc -n elibrary

echo.
echo 3. TEST PROMETHEUS:
echo ==================
echo Test connectivite Prometheus...
curl -s http://localhost:9090/api/v1/query?query=up | findstr "success" && echo [OK] Prometheus accessible || echo [ERREUR] Prometheus inaccessible

echo.
echo 4. TEST GRAFANA:
echo ===============
echo Test connectivite Grafana...
curl -s http://localhost:3000/api/health | findstr "ok" && echo [OK] Grafana accessible || echo [ERREUR] Grafana inaccessible

echo.
echo 5. METRIQUES PRINCIPALES:
echo ========================
echo Services UP/DOWN:
curl -s "http://localhost:9090/api/v1/query?query=up" | findstr "value"

echo.
echo 6. RESSOURCES CLUSTER:
echo =====================
kubectl top pods -n elibrary 2>nul || echo Metrics-server non disponible

echo.
echo ========================================
echo VERIFICATION TERMINEE
echo ========================================
echo.
echo Acces interfaces:
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3000
echo.
pause