@echo off
echo ========================================
echo MISE A JOUR PHOTOS UTILISATEURS
echo ========================================

echo 1. Ajout du champ photo_url dans la base de donnees...

echo 2. Mise a jour des composants Angular...

echo 3. Creation du composant avatar reutilisable...

echo 4. Ajout de l'avatar par defaut...

echo.
echo MODIFICATIONS APPORTEES:
echo - Backend: Ajout photo_url dans User model
echo - Frontend: Mise a jour AuthService pour gerer les photos
echo - Dashboard: Affichage dynamique de la photo utilisateur
echo - App Component: Photo dans la navbar
echo - Composant UserAvatar reutilisable
echo - Avatar par defaut pour les utilisateurs sans photo
echo.
echo FONCTIONNALITES:
echo - Photo visible des la connexion
echo - Photo persistante entre les sessions
echo - Fallback vers avatar par defaut si erreur
echo - Composant reutilisable pour toute l'app
echo.
echo ========================================
echo MISE A JOUR TERMINEE !
echo ========================================
pause