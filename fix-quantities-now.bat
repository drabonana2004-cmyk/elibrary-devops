@echo off
echo 🔧 Correction immediate des quantites pour utilisateurs...

echo.
echo 📋 Etapes de correction:
echo 1. Injection du script de masquage
echo 2. Verification du role utilisateur
echo 3. Masquage des quantites si necessaire

echo.
echo 💻 Ouvrez la console du navigateur (F12) et collez ce code:

echo.
echo ================================================
type hide-quantities-immediate.js
echo ================================================

echo.
echo 📝 Instructions:
echo 1. Ouvrez votre navigateur sur http://localhost:4200
echo 2. Appuyez sur F12 pour ouvrir les outils developpeur
echo 3. Allez dans l'onglet Console
echo 4. Copiez-collez le code ci-dessus
echo 5. Appuyez sur Entree

echo.
echo ✅ Les quantites seront masquees immediatement pour les utilisateurs non-admin
echo ❌ Les administrateurs continueront a voir les quantites

pause