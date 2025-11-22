@echo off
echo 🚀 DEMONSTRATION KUBERNETES - eLibrary

echo.
echo 📋 Deploiement de l'application eLibrary sur Kubernetes
echo.

echo 🔧 Etape 1: Creation du namespace
kubectl apply -f k8s/namespace.yaml

echo.
echo 🗄️  Etape 2: Deploiement MySQL
kubectl apply -f k8s/simple-mysql.yaml

echo.
echo 🔧 Etape 3: Deploiement Backend Laravel
kubectl apply -f k8s/simple-backend.yaml

echo.
echo 🎨 Etape 4: Deploiement Frontend Angular
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo ⏳ Attente du demarrage des pods...
timeout /t 15

echo.
echo 📊 STATUS DU DEPLOIEMENT:
echo.
echo === NAMESPACE ===
kubectl get namespaces | findstr elibrary

echo.
echo === PODS ===
kubectl get pods -n elibrary

echo.
echo === SERVICES ===
kubectl get services -n elibrary

echo.
echo === DEPLOYMENTS ===
kubectl get deployments -n elibrary

echo.
echo 🌐 ACCES A L'APPLICATION:
echo Frontend: http://localhost:30080
echo Backend API: http://localhost:30800

echo.
echo 🔍 COMMANDES UTILES:
echo kubectl get all -n elibrary
echo kubectl logs -l app=frontend -n elibrary
echo kubectl describe pod [nom-pod] -n elibrary

echo.
echo ✅ Deploiement Kubernetes termine!
pause