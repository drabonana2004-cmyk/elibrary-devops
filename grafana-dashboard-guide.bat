@echo off
echo ========================================
echo GUIDE DASHBOARD GRAFANA - ELIBRARY
echo ========================================

echo.
echo 1. DEMARRAGE GRAFANA:
echo =====================
echo Verifiez que Grafana est accessible:
kubectl port-forward svc/grafana-service 3000:3000 -n elibrary

echo.
echo 2. ACCES GRAFANA:
echo =================
echo URL: http://localhost:3000
echo Login: admin
echo Password: admin123

echo.
echo 3. CREATION DASHBOARD:
echo ======================
echo Dans Grafana:
echo - Cliquez sur "+" puis "Dashboard"
echo - Cliquez "Add visualization"
echo - Selectionnez "Prometheus"

echo.
echo 4. PANELS A CREER:
echo ==================
echo.
echo PANEL 1 - Services Status:
echo - Metric: up
echo - Type: Stat
echo - Title: "eLibrary Services Status"
echo - Description: "Status des services (1=UP, 0=DOWN)"
echo.
echo PANEL 2 - Prometheus Targets:
echo - Metric: prometheus_notifications_total
echo - Type: Stat  
echo - Title: "Prometheus Targets"
echo.
echo PANEL 3 - Uptime:
echo - Metric: up
echo - Type: Time series
echo - Title: "Services Uptime"
echo.
echo PANEL 4 - Query Rate:
echo - Metric: prometheus_http_requests_total
echo - Type: Graph
echo - Title: "HTTP Requests"

echo.
echo 5. SAUVEGARDE:
echo ==============
echo - Cliquez "Save dashboard" (icone disquette)
echo - Nom: "eLibrary Monitoring Dashboard"
echo - Cliquez "Save"

echo.
echo 6. CAPTURE D'ECRAN:
echo ===================
echo - Prenez une capture d'ecran complete du dashboard
echo - Sauvegardez comme: "grafana-dashboard-elibrary.png"
echo - Placez dans le dossier du projet

echo.
echo ========================================
echo DASHBOARD PRET POUR CAPTURE !
echo ========================================
pause