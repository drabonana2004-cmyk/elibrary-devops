@echo off
echo ========================================
echo CAPTURE DASHBOARD GRAFANA - ELIBRARY
echo ========================================

echo.
echo 1. PREPARATION:
echo ===============
echo Verifiez que Grafana est accessible...
start /b kubectl port-forward svc/grafana-service 3000:3000 -n elibrary
timeout /t 5 /nobreak >nul

echo.
echo 2. OUVERTURE AUTOMATIQUE:
echo =========================
echo Ouverture de Grafana dans le navigateur...
start http://localhost:3000

echo.
echo 3. INSTRUCTIONS CAPTURE:
echo ========================
echo Dans Grafana:
echo 1. Connectez-vous: admin / admin123
echo 2. Allez dans Dashboards
echo 3. Ouvrez "eLibrary Monitoring Dashboard"
echo 4. Attendez que les metriques se chargent
echo 5. Appuyez sur F11 (plein ecran)
echo 6. Prenez la capture: Win + Shift + S
echo 7. Sauvegardez: grafana-dashboard-elibrary.png

echo.
echo 4. ELEMENTS A INCLURE:
echo ======================
echo - Titre du dashboard
echo - Panel Services Status (5/5 UP)
echo - Panel Prometheus Targets
echo - Graphique Services Uptime
echo - Graphique HTTP Requests
echo - Timestamp en bas

echo.
echo 5. COMMENTAIRES REQUIS:
echo =======================
echo Apres la capture, documentez:
echo - Status des services (UP/DOWN)
echo - Metriques Prometheus actives
echo - Graphiques temporels
echo - Indicateurs de sante

echo.
echo ========================================
echo CAPTURE PRETE !
echo ========================================
echo.
echo Dashboard accessible sur: http://localhost:3000
echo Login: admin / admin123
echo.
echo Une fois la capture prise, placez le fichier
echo grafana-dashboard-elibrary.png dans ce dossier.
echo.
pause