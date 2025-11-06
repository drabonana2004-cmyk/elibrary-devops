@echo off
echo ========================================
echo SUPERVISION ELIBRARY - PROMETHEUS + GRAFANA
echo ========================================

echo.
echo 1. DEMARRAGE SUPERVISION:
echo =========================
echo Demarrage Prometheus...
start /b kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary
timeout /t 2 /nobreak >nul

echo Demarrage Grafana...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 2 /nobreak >nul

echo.
echo 2. VERIFICATION SERVICES:
echo =========================
kubectl get pods -n elibrary | findstr prometheus
kubectl get pods -n elibrary | findstr grafana

echo.
echo 3. ACCES INTERFACES:
echo ===================
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3000 (admin/admin123)

echo.
echo Ouverture automatique...
start http://localhost:9090
start http://localhost:3000

echo.
echo 4. METRIQUES A SURVEILLER:
echo ==========================
echo - up (status services)
echo - prometheus_notifications_total
echo - prometheus_http_requests_total
echo - kube_pod_status_phase
echo - container_memory_usage_bytes

echo.
echo ========================================
echo SUPERVISION ACTIVE !
echo ========================================
pause