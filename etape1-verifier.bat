@echo off
echo ========================================
echo ETAPE 1 - VERIFICATION SYSTEME
echo ========================================

echo.
echo Verification des pods elibrary...
kubectl get pods -n elibrary

echo.
echo Verification des services...
kubectl get svc -n elibrary

echo.
echo ========================================
echo RESULTATS:
echo ========================================
echo Si vous voyez prometheus et grafana dans la liste,
echo passez a l'etape 2.
echo.
echo Sinon, nous devons les deployer d'abord.
echo.
pause