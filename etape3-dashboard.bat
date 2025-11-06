@echo off
echo ========================================
echo ETAPE 3 - CREATION DASHBOARD SUPERVISION
echo ========================================

echo.
echo DANS GRAFANA (http://localhost:3000):
echo ===================================
echo.
echo 1. CONNEXION:
echo    - Login: admin
echo    - Password: admin123
echo.
echo 2. NOUVEAU DASHBOARD:
echo    - Cliquez sur "+" (menu gauche)
echo    - Cliquez "Create Dashboard"
echo.
echo 3. PREMIER PANEL - STATUS SERVICES:
echo    - Cliquez "Add visualization"
echo    - Datasource: Prometheus
echo    - Query: up
echo    - Visualization: Stat
echo    - Panel title: "Services eLibrary Status"
echo    - Cliquez "Save"
echo.
echo 4. SAUVEGARDER DASHBOARD:
echo    - Nom: "eLibrary Supervision"
echo    - Cliquez "Save"
echo.
echo ========================================
echo SUPERVISION OPERATIONNELLE !
echo ========================================
echo.
echo Votre dashboard montre:
echo - Services UP (valeur 1) ou DOWN (valeur 0)
echo - Status en temps reel
echo - Historique des pannes
echo.
pause