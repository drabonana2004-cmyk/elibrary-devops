// SOLUTION IMMEDIATE - Collez ce code dans la console (F12)

console.log('=== FORCER AFFICHAGE PHOTO UTILISATEUR ===');

// 1. Récupérer l'utilisateur actuel
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Utilisateur actuel:', currentUser);

// 2. Créer une photo de test avec les initiales
const userName = currentUser.name || 'User';
const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
const photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4B7688&color=fff&size=100&font-size=0.6`;

console.log('Photo générée:', photoUrl);

// 3. Sauvegarder la photo dans TOUS les endroits
currentUser.photo_url = photoUrl;
localStorage.setItem('user', JSON.stringify(currentUser));
localStorage.setItem('userPhoto_' + currentUser.email, photoUrl);
localStorage.setItem('currentUserPhoto', photoUrl);

// Mettre à jour aussi dans registeredUsers
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
if (userIndex >= 0) {
    registeredUsers[userIndex].photo_url = photoUrl;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

console.log('Photo sauvegardée dans tous les endroits');

// 4. Appliquer immédiatement à toutes les images de profil
const profileImages = document.querySelectorAll('img[alt*="profil"], img.profile-pic, img.rounded-circle');
profileImages.forEach(img => {
    img.src = photoUrl;
    console.log('Photo appliquée à:', img);
});

// 5. Recharger la page pour s'assurer que tout fonctionne
setTimeout(() => {
    console.log('Rechargement de la page...');
    location.reload();
}, 2000);

console.log('✅ PHOTO FORCÉE - La page va se recharger dans 2 secondes');