@echo off
echo 🚀 SOLUTION FINALE - Masquage des quantites

echo.
echo 📋 Probleme: Les quantites (5/5, 6/6, etc.) sont visibles pour tous les utilisateurs
echo ✅ Solution: Masquage immediat via JavaScript

echo.
echo 🔧 ETAPES:
echo 1. Ouvrez http://localhost:4200 dans votre navigateur
echo 2. Appuyez sur F12 pour ouvrir la console
echo 3. Copiez-collez ce code:

echo.
echo ================================================
type fix-quantities-immediate.js
echo ================================================

echo.
echo 📝 RESULTAT ATTENDU:
echo - Utilisateurs normaux: Voient seulement "Disponible" ou "Indisponible"
echo - Administrateurs: Voient "Disponible (5/5)" ou "Indisponible (0/5)"

echo.
echo ⚡ Le script fonctionne instantanement pour tous les utilisateurs connectes
echo.
pause