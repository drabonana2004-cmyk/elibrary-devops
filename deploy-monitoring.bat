@echo off
echo ========================================
echo DEPLOIEMENT MONITORING - PROMETHEUS + GRAFANA
echo ========================================

echo.
echo 1. DEPLOIEMENT PROMETHEUS:
kubectl apply -f k8s/monitoring/prometheus.yaml
echo Attente Prometheus...
timeout /t 15 /nobreak >nul

echo.
echo 2. DEPLOIEMENT GRAFANA:
kubectl apply -f k8s/monitoring/grafana.yaml
echo Attente Grafana...
timeout /t 15 /nobreak >nul

echo.
echo 3. VERIFICATION DEPLOIEMENT:
kubectl get pods -n elibrary | findstr -i "prometheus grafana"

echo.
echo 4. VERIFICATION SERVICES:
kubectl get svc -n elibrary | findstr -i "prometheus grafana"

echo.
echo 5. STATUS MONITORING:
kubectl get all -n elibrary -l app=prometheus
kubectl get all -n elibrary -l app=grafana

echo.
echo ========================================
echo MONITORING DEPLOYE !
echo ========================================
echo.
echo Acces aux interfaces:
echo - Prometheus: kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary
echo - Grafana: kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
echo.
echo Grafana Login:
echo - URL: http://localhost:3000
echo - Username: admin
echo - Password: admin123
echo.
echo Dashboard eLibrary pre-configure !
echo.
pause