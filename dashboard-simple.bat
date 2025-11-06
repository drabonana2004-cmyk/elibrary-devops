@echo off
echo ========================================
echo CREATION DASHBOARD SIMPLE GRAFANA
echo ========================================

echo.
echo DANS GRAFANA (http://localhost:3000):
echo ===================================
echo Login: admin / admin123
echo.
echo ETAPES CREATION DASHBOARD:
echo =========================
echo.
echo 1. NOUVEAU DASHBOARD:
echo    - Clic "+" (menu gauche)
echo    - Clic "Create Dashboard"
echo.
echo 2. PANEL 1 - STATUS PROMETHEUS:
echo    - Clic "Add visualization"
echo    - Datasource: Prometheus
echo    - Query: up
echo    - Type: Stat
echo    - Title: "Prometheus Status"
echo    - Save
echo.
echo 3. PANEL 2 - SYSTEM INFO:
echo    - Clic "Add panel"
echo    - Query: prometheus_build_info
echo    - Type: Table
echo    - Title: "System Information"
echo    - Save
echo.
echo 4. PANEL 3 - HTTP REQUESTS:
echo    - Clic "Add panel"
echo    - Query: rate(prometheus_http_requests_total[5m])
echo    - Type: Time series
echo    - Title: "HTTP Requests Rate"
echo    - Save
echo.
echo 5. SAUVEGARDER:
echo    - Nom: "eLibrary Monitoring"
echo    - Save dashboard
echo.
echo ========================================
echo DASHBOARD OPERATIONNEL !
echo ========================================
pause