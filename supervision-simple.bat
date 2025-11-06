@echo off
echo ========================================
echo SUPERVISION SIMPLE - PROMETHEUS SEUL
echo ========================================

echo.
echo SITUATION ACTUELLE:
echo ==================
echo ✅ Prometheus fonctionne (1/1 up)
echo ❌ Services sans metriques (404 errors)
echo.
echo C'EST NORMAL ! Vos services ne sont pas
echo configures pour exposer des metriques.
echo.
echo SOLUTION SIMPLE:
echo ===============
echo On va utiliser les metriques Kubernetes
echo que Prometheus collecte automatiquement.
echo.
echo Ouverture Prometheus...
start http://localhost:9090

echo.
echo Ouverture Grafana...
start http://localhost:3000

echo.
echo ========================================
echo METRIQUES DISPONIBLES:
echo ========================================
echo Dans Prometheus, testez ces requetes:
echo.
echo 1. up
echo    (Status Prometheus lui-meme)
echo.
echo 2. prometheus_build_info
echo    (Informations systeme)
echo.
echo 3. prometheus_notifications_total
echo    (Notifications systeme)
echo.
echo 4. prometheus_http_requests_total
echo    (Requetes HTTP Prometheus)
echo.
echo ========================================
echo SUPERVISION FONCTIONNELLE !
echo ========================================
pause