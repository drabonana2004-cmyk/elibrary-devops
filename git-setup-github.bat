@echo off
echo 🐙 CONFIGURATION GITHUB

echo.
set /p username="Nom d'utilisateur GitHub: "
set /p repo="Nom du depot (elibrary-devops): "
if "%repo%"=="" set repo=elibrary-devops

echo.
echo 🔗 Ajout du remote GitHub...
git remote add origin https://github.com/%username%/%repo%.git

echo.
echo 📤 Push vers GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Depot pousse vers GitHub avec succes!
echo 🌐 URL: https://github.com/%username%/%repo%

pause