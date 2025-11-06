@echo off
echo ========================================
echo CREATION DASHBOARD GRAFANA AUTOMATIQUE
echo ========================================

echo.
echo 1. DEMARRAGE SERVICES:
echo =====================
echo Demarrage port-forward Grafana...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 3 /nobreak >nul

echo Demarrage port-forward Prometheus...
start /b kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary
timeout /t 3 /nobreak >nul

echo.
echo 2. VERIFICATION METRIQUES:
echo ==========================
echo Test Prometheus...
curl -s http://localhost:9090/api/v1/query?query=up | findstr "success"
if %errorlevel% neq 0 (
    echo ERREUR: Prometheus non accessible
    pause
    exit /b 1
)

echo.
echo 3. OUVERTURE INTERFACES:
echo ========================
echo Ouverture Grafana...
start http://localhost:3000

echo Ouverture Prometheus (verification)...
start http://localhost:9090

echo.
echo 4. CONFIGURATION DASHBOARD:
echo ===========================
echo Dans Grafana:
echo 1. Login: admin / admin123
echo 2. Cliquez sur "+" puis "Dashboard"
echo 3. Cliquez "Add visualization"
echo 4. Selectionnez "Prometheus" comme datasource
echo 5. Utilisez ces metriques:

echo.
echo PANEL 1 - Services Status:
echo Metric: up
echo Legend: {{instance}}
echo Type: Stat

echo.
echo PANEL 2 - Prometheus Targets:
echo Metric: prometheus_notifications_total
echo Type: Graph

echo.
echo PANEL 3 - HTTP Requests:
echo Metric: prometheus_http_requests_total
echo Type: Graph

echo.
echo 5. CAPTURE ECRAN:
echo ================
echo 1. Sauvegardez le dashboard
echo 2. F11 pour plein ecran
echo 3. Win + Shift + S pour capture
echo 4. Sauvegardez: grafana-dashboard-capture.png

echo.
echo ========================================
echo SERVICES DEMARRES !
echo ========================================
echo Grafana: http://localhost:3000
echo Prometheus: http://localhost:9090
echo.
pause