@echo off
echo ========================================
echo TEST PERSISTANCE PHOTO UTILISATEUR
echo ========================================

echo 1. CORRECTIONS APPORTEES:
echo - Login: Recuperation photo depuis toutes les sources
echo - LoadUserFromStorage: Mise a jour systematique
echo - BooksComponent: Debug et forçage affichage
echo - Sauvegarde multiple: user + userPhoto_ + registeredUsers

echo.
echo 2. POUR TESTER LA PERSISTANCE:
echo a) Connectez-vous avec un compte qui a une photo
echo b) Fermez le navigateur completement
echo c) Rouvrez et reconnectez-vous
echo d) La photo doit s'afficher immediatement

echo.
echo 3. VERIFICATION DANS LA CONSOLE:
echo - Ouvrez F12 > Console
echo - Vous verrez les logs de debug photo
echo - Verifiez que "Final photo URL" n'est pas l'avatar par defaut

echo.
echo 4. SI LA PHOTO NE S'AFFICHE TOUJOURS PAS:
echo - Executez dans la console:
echo   localStorage.getItem('user')
echo   localStorage.getItem('userPhoto_[email]')
echo   localStorage.getItem('registeredUsers')

echo.
echo ========================================
echo REDEMARREZ LE FRONTEND POUR TESTER
echo ========================================
pause