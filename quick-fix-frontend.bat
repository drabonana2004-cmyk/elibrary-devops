@echo off
echo ========================================
echo CORRECTION RAPIDE FRONTEND
echo ========================================

echo Le probleme: Vous accedez a la page Kubernetes statique
echo au lieu du vrai frontend Angular !

echo.
echo SOLUTION IMMEDIATE:
echo.
echo 1. Arretez Kubernetes:
echo    kubectl delete namespace elibrary
echo.
echo 2. Demarrez le vrai frontend:
echo    cd frontend
echo    npx ng serve --host=0.0.0.0 --port=4200
echo.
echo 3. Demarrez le backend:
echo    cd backend  
echo    php artisan serve --host=0.0.0.0 --port=8000
echo.

echo OU EXECUTEZ SIMPLEMENT:
echo stop-kubernetes-start-angular.bat
echo.

echo ========================================
echo APRES CA VOUS AUREZ LE VRAI FRONTEND !
echo ========================================
pause