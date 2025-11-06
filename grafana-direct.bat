@echo off
echo ========================================
echo ACCES DIRECT GRAFANA - ELIBRARY
echo ========================================

echo Demarrage port-forward Grafana...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 3 /nobreak >nul

echo Ouverture Grafana...
start http://localhost:3000

echo.
echo ========================================
echo ETAPES SIMPLES:
echo ========================================
echo 1. Login: admin / admin123
echo 2. Clic "+" puis "Dashboard"
echo 3. Clic "Add visualization"
echo 4. Selectionnez "Prometheus"
echo 5. Dans Query, tapez: up
echo 6. Clic "Run query"
echo 7. Clic "Apply"
echo 8. F11 pour plein ecran
echo 9. Win + Shift + S pour capture
echo.
pause