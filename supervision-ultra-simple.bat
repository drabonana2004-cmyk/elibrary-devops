@echo off
echo ========================================
echo SUPERVISION ULTRA SIMPLE - POUR DEBUTANTS
echo ========================================

echo.
echo QU'EST-CE QUE C'EST ?
echo ====================
echo Prometheus = Surveille si vos services marchent
echo Grafana = Affiche des graphiques jolis
echo.
echo C'EST COMME QUOI ?
echo =================
echo Imaginez un gardien (Prometheus) qui regarde
echo si vos services sont allumes ou eteints.
echo.
echo Puis un tableau de bord (Grafana) qui montre
echo des voyants verts/rouges.
echo.
echo ON FAIT QUOI MAINTENANT ?
echo =========================
echo 1. On ouvre les 2 sites web
echo 2. On regarde si ca marche
echo 3. On fait une capture d'ecran
echo 4. C'est fini !
echo.
echo Ouverture automatique...
start http://localhost:9090
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo SITES OUVERTS !
echo ========================================
echo.
echo Site 1: Prometheus (http://localhost:9090)
echo - C'est le "gardien" qui surveille
echo.
echo Site 2: Grafana (http://localhost:3000)
echo - C'est le "tableau de bord" joli
echo - Login: admin
echo - Password: admin123
echo.
echo PROCHAINE ETAPE: Lancez .\grafana-facile.bat
echo.
pause