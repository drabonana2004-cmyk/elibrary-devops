@echo off
echo ========================================
echo AJOUT PHOTO UTILISATEUR TEST
echo ========================================

echo Ce script va ajouter une photo de test pour l'utilisateur DRABO
echo.

echo 1. Ouvrez la console du navigateur (F12)
echo 2. Allez dans l'onglet Console
echo 3. Collez ce code JavaScript:

echo.
echo // Ajouter une photo de test pour DRABO
echo const testPhotoUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Qjc2ODgiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5EPC90ZXh0Pgo8L3N2Zz4K';
echo const user = JSON.parse(localStorage.getItem('user') ^|^| '{}');
echo user.photo_url = testPhotoUrl;
echo localStorage.setItem('user', JSON.stringify(user));
echo localStorage.setItem('userPhoto_' + user.email, testPhotoUrl);
echo console.log('Photo ajoutee pour:', user.email);
echo location.reload();

echo.
echo 4. Appuyez sur Entree pour executer
echo 5. La page va se recharger avec la photo

echo.
echo ========================================
echo ALTERNATIVE: PHOTO PERSONNALISEE
echo ========================================
echo.
echo Pour ajouter votre propre photo:
echo 1. Convertissez votre image en base64 sur: https://base64.guru/converter/encode/image
echo 2. Remplacez testPhotoUrl par votre URL base64
echo 3. Executez le code dans la console

pause