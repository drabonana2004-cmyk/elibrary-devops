@echo off
echo ========================================
echo GRAFANA FACILE - ETAPES SIMPLES
echo ========================================

echo.
echo DANS GRAFANA (http://localhost:3000):
echo ===================================
echo.
echo ETAPE 1 - SE CONNECTER:
echo   Tapez: admin
echo   Tapez: admin123
echo   Cliquez: Sign in
echo.
echo ETAPE 2 - NOUVEAU TABLEAU:
echo   Cliquez sur le "+" a gauche
echo   Cliquez: "Create Dashboard"
echo.
echo ETAPE 3 - AJOUTER UN GRAPHIQUE:
echo   Cliquez: "Add visualization"
echo   Laissez "Prometheus" selectionne
echo   Dans la case "Query", tapez: up
echo   Cliquez: "Run query"
echo   Vous devriez voir un chiffre !
echo.
echo ETAPE 4 - SAUVEGARDER:
echo   Cliquez: "Save" (en haut a droite)
echo   Tapez un nom: "Mon Dashboard"
echo   Cliquez: "Save"
echo.
echo ETAPE 5 - CAPTURE D'ECRAN:
echo   Appuyez: Win + Shift + S
echo   Selectionnez votre dashboard
echo   Sauvegardez: supervision-elibrary.png
echo.
echo ========================================
echo C'EST TOUT ! VOUS AVEZ REUSSI !
echo ========================================
echo.
echo Votre supervision fonctionne si vous voyez
echo un chiffre "1" dans votre graphique.
echo.
pause