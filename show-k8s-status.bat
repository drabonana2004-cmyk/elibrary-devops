@echo off
echo 📊 STATUS KUBERNETES - eLibrary

echo.
echo === TOUS LES OBJETS ===
kubectl get all -n elibrary

echo.
echo === DETAILS DES PODS ===
kubectl get pods -n elibrary -o wide

echo.
echo === LOGS FRONTEND ===
kubectl logs -l app=frontend -n elibrary --tail=10

echo.
echo === LOGS BACKEND ===
kubectl logs -l app=backend -n elibrary --tail=10

echo.
echo 🌐 URLs d'acces:
echo Frontend: http://localhost:30080
echo Backend: http://localhost:30800

pause