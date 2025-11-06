@echo off
echo ========================================
echo GRAFANA DEJA ACTIF - ACCES DIRECT
echo ========================================

echo Ouverture Grafana (deja en cours)...
start http://localhost:3000

echo.
echo ========================================
echo CREATION DASHBOARD SIMPLE:
echo ========================================
echo 1. Login: admin / admin123
echo 2. Clic "+" (menu gauche)
echo 3. Clic "Create Dashboard"
echo 4. Clic "Add visualization"
echo 5. Query: up
echo 6. Clic "Save" (en haut a droite)
echo 7. Nom: "eLibrary Dashboard"
echo 8. Clic "Save"
echo 9. F11 pour plein ecran
echo 10. Win + Shift + S pour capture
echo.
echo IMPORTANT: Le bouton "Apply" est devenu "Save"
echo dans les nouvelles versions de Grafana !
echo.
pause