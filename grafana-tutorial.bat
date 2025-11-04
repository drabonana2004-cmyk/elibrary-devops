@echo off
echo ========================================
echo TUTORIEL DASHBOARD GRAFANA - SIMPLE
echo ========================================

echo.
echo ETAPE 1: OUVRIR GRAFANA
echo - Allez sur http://localhost:3000
echo - Connectez-vous avec admin / admin123

echo.
echo ETAPE 2: CREER UN NOUVEAU DASHBOARD
echo - Cliquez sur le "+" dans le menu de gauche
echo - Selectionnez "Dashboard"
echo - Cliquez "Add visualization"

echo.
echo ETAPE 3: CONFIGURER LA SOURCE DE DONNEES
echo - Selectionnez "Prometheus" dans la liste
echo - Si pas visible, cliquez "Configure a new data source"

echo.
echo ETAPE 4: AJOUTER UN GRAPHIQUE SIMPLE
echo - Dans le champ "Metric", tapez: up
echo - Cliquez "Run queries" (bouton bleu)
echo - Vous devriez voir des donnees apparaitre

echo.
echo ETAPE 5: PERSONNALISER LE GRAPHIQUE
echo - Dans "Panel options" (a droite):
echo   * Title: "Services eLibrary Status"
echo   * Description: "Status des services (1=UP, 0=DOWN)"
echo - Cliquez "Apply" pour sauvegarder

echo.
echo ETAPE 6: SAUVEGARDER LE DASHBOARD
echo - Cliquez l'icone "Save" (disquette) en haut
echo - Nom: "eLibrary Monitoring"
echo - Cliquez "Save"

echo.
echo ========================================
echo DASHBOARD CREE !
echo ========================================
echo.
echo Votre premier dashboard Grafana est pret !
echo Il montre si vos services sont actifs (UP) ou non (DOWN).
echo.
pause