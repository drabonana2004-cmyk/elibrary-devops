// Script à exécuter dans la console du navigateur (F12)
// pour forcer l'affichage de la photo utilisateur

console.log('=== CORRECTION PHOTO UTILISATEUR ===');

// 1. Récupérer l'utilisateur actuel
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Utilisateur actuel:', currentUser);

// 2. Créer une photo de test
const userName = currentUser.name || 'User';
const testPhotoUrl = `https://ui-avatars.com/api/?name=${userName}&background=4B7688&color=fff&size=40`;

console.log('URL photo de test:', testPhotoUrl);

// 3. Mettre à jour les données
currentUser.photo_url = testPhotoUrl;
localStorage.setItem('user', JSON.stringify(currentUser));
localStorage.setItem('userPhoto_' + currentUser.email, testPhotoUrl);

console.log('Données mises à jour dans localStorage');

// 4. Forcer le rechargement de la page
console.log('Rechargement de la page...');
setTimeout(() => {
    location.reload();
}, 1000);

console.log('=== SCRIPT TERMINÉ ===');