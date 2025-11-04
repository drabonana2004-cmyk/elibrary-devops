@echo off
echo ========================================
echo CREATION DASHBOARD ELIBRARY
echo ========================================

echo.
echo Dashboard Grafana accessible !
echo URL: http://localhost:3000
echo Login: admin / admin123

echo.
echo ETAPES POUR CREER LE DASHBOARD:
echo.
echo 1. Dans Grafana, cliquez sur "+" puis "Dashboard"
echo 2. Cliquez "Add visualization"
echo 3. Selectionnez "Prometheus" comme data source
echo 4. Utilisez ces metriques:

echo.
echo METRIQUES ELIBRARY:
echo ==================
echo.
echo Panel 1 - Services Status:
echo   Metric: up{job=~"elibrary.*"}
echo   Type: Stat
echo   Title: "eLibrary Services Status"
echo.
echo Panel 2 - Pod Count:
echo   Metric: count(kube_pod_info{namespace="elibrary"})
echo   Type: Stat  
echo   Title: "Total Pods"
echo.
echo Panel 3 - Memory Usage:
echo   Metric: container_memory_usage_bytes{namespace="elibrary"}
echo   Type: Time series
echo   Title: "Memory Usage by Pod"
echo.
echo Panel 4 - CPU Usage:
echo   Metric: rate(container_cpu_usage_seconds_total{namespace="elibrary"}[5m])
echo   Type: Time series
echo   Title: "CPU Usage Rate"

echo.
echo 5. Sauvegardez le dashboard avec le nom "eLibrary Monitoring"

echo.
echo ========================================
echo DASHBOARD PRET !
echo ========================================
pause