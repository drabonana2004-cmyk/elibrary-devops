@echo off
echo 🚀 DEMO: Frontend Angular + Kubernetes en parallele

echo.
echo 📋 Configuration:
echo - Frontend Angular: http://localhost:4200 (developpement)
echo - Kubernetes: http://localhost:30080 (production)
echo - Base de donnees: MySQL sur port 3306

echo.
echo 🔧 Etape 1: Demarrage MySQL
docker-compose -f docker-compose.simple.yml up -d

echo.
echo 🔧 Etape 2: Demarrage Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/simple-mysql.yaml
kubectl apply -f k8s/simple-backend.yaml
kubectl apply -f k8s/simple-frontend.yaml

echo.
echo 🔧 Etape 3: Demarrage Frontend Angular (nouvelle fenetre)
start cmd /k "cd frontend && npm start"

echo.
echo ⏳ Attente du demarrage des services...
timeout /t 10

echo.
echo 🌐 ACCES AUX SERVICES:
echo.
echo 📱 Frontend Angular (Developpement):
echo    URL: http://localhost:4200
echo    Status: Developpement avec hot-reload
echo.
echo 🐳 Kubernetes (Production):
echo    URL: http://localhost:30080
echo    Status: Version conteneurisee
echo.
echo 🗄️  Base de donnees MySQL:
echo    Port: 3306
echo    Utilisateur: root
echo    Mot de passe: secretpassword

echo.
echo 📊 Verification des services:
echo.
echo Kubernetes pods:
kubectl get pods -n elibrary

echo.
echo Docker containers:
docker ps

echo.
echo ✅ Demo prete! Vous pouvez maintenant:
echo 1. Tester le frontend Angular sur http://localhost:4200
echo 2. Comparer avec la version Kubernetes sur http://localhost:30080
echo 3. Montrer les deux versions en parallele

pause