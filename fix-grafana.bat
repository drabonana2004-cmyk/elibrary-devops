@echo off
echo ========================================
echo CORRECTION GRAFANA LOGIN
echo ========================================

echo.
echo 1. VERIFICATION POD GRAFANA:
kubectl get pods -n elibrary -l app=grafana

echo.
echo 2. LOGS GRAFANA:
kubectl logs -l app=grafana -n elibrary --tail=20

echo.
echo 3. REDEMARRAGE GRAFANA:
kubectl delete pod -l app=grafana -n elibrary
echo Attente redemarrage...
timeout /t 15 /nobreak >nul

echo.
echo 4. NOUVEAU STATUS:
kubectl get pods -n elibrary -l app=grafana

echo.
echo 5. TEST CONNEXION:
echo Demarrage port-forward...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo GRAFANA CORRIGE !
echo ========================================
echo.
echo Essayez maintenant:
echo - URL: http://localhost:3000
echo - Username: admin
echo - Password: admin123
echo.
echo Si ca ne marche pas, utilisez:
echo - Username: admin
echo - Password: admin
echo.
pause