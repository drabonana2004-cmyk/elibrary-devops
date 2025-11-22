@echo off
echo 🔄 REINITIALISATION COMPLETE GIT

echo.
echo ⚠️  ATTENTION: Cette operation va supprimer tout l'historique Git existant
echo.
set /p confirm="Continuer? (o/n): "
if /i not "%confirm%"=="o" exit /b

echo.
echo 🗑️  Suppression du repertoire .git...
if exist .git rmdir /s /q .git

echo.
echo 🆕 Initialisation nouveau depot Git...
git init

echo.
echo 📝 Configuration Git...
git config user.name "eLibrary DevOps"
git config user.email "elibrary@devops.local"

echo.
echo 📋 Ajout de tous les fichiers...
git add .

echo.
echo 💾 Premier commit...
git commit -m "🚀 Initial commit - eLibrary DevOps Complete

✨ Features:
- Frontend Angular 17 avec interface utilisateur complete
- Backend Laravel 11 avec API REST
- Base de donnees MySQL 8.0
- Orchestration Kubernetes complete
- Pipeline CI/CD GitHub Actions
- Monitoring Prometheus + Grafana
- Gestion des photos utilisateurs
- Systeme de permissions admin/user
- Masquage des quantites pour utilisateurs

🏗️ Architecture:
- Conteneurisation Docker
- Deploiement Kubernetes
- Monitoring integre
- Scripts d'automatisation

📊 Status: Production Ready"

echo.
echo ✅ Depot Git reinitialise avec succes!
echo.
echo 📤 Pour connecter a GitHub:
echo git remote add origin https://github.com/votre-username/elibrary-devops.git
echo git branch -M main
echo git push -u origin main

pause