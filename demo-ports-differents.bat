@echo off
echo 🎯 DEMO: Ports differents pour comparaison

echo.
echo 🔧 Configuration des ports:
echo - Angular Dev: http://localhost:4200
echo - Kubernetes: http://localhost:30080  
echo - Backend API: http://localhost:8000
echo - MySQL: localhost:3306

echo.
echo 🚀 Demarrage des services...

echo.
echo 1️⃣ MySQL
docker-compose -f docker-compose.simple.yml up -d

echo.
echo 2️⃣ Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/simple-mysql.yaml
kubectl apply -f k8s/simple-backend.yaml
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo 3️⃣ Frontend Angular (port 4200)
start "Angular Dev" cmd /k "cd frontend && ng serve --port 4200"

echo.
echo ⏳ Attente 15 secondes...
timeout /t 15

echo.
echo 🌐 URLS DE DEMONSTRATION:
echo.
echo 🔥 Version Developpement (Angular):
echo    http://localhost:4200
echo.
echo 🐳 Version Production (Kubernetes):  
echo    http://localhost:30080
echo.
echo 📊 Status des services:
kubectl get all -n elibrary

echo.
echo ✅ Pret pour la demonstration!
pause