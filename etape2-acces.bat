@echo off
echo ========================================
echo ETAPE 2 - ACCES AUX INTERFACES
echo ========================================

echo.
echo Ouverture Prometheus...
start http://localhost:9090

echo.
echo Ouverture Grafana...
start http://localhost:3000

echo.
echo ========================================
echo ACCES INTERFACES:
echo ========================================
echo Prometheus: http://localhost:9090
echo - Cliquez sur "Status" puis "Targets"
echo - Verifiez que les services sont "UP"
echo.
echo Grafana: http://localhost:3000
echo - Login: admin
echo - Password: admin123
echo.
echo ========================================
echo ETAPE 2 TERMINEE !
echo ========================================
echo.
echo Une fois connecte aux deux interfaces,
echo lancez: .\etape3-dashboard.bat
echo.
pause