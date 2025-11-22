// Script à exécuter dans la console pour tester la photo
// Ouvrez F12 > Console et collez ce code

console.log('=== TEST PHOTO UTILISATEUR ===');

// 1. Vérifier les données stockées
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userPhoto = localStorage.getItem('userPhoto_' + user.email);
const currentPhoto = localStorage.getItem('currentUserPhoto');
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
const registeredUser = registeredUsers.find(u => u.email === user.email);

console.log('Utilisateur:', user);
console.log('Photo utilisateur:', userPhoto);
console.log('Photo courante:', currentPhoto);
console.log('Utilisateur enregistré:', registeredUser);

// 2. Déterminer quelle photo utiliser
let finalPhoto = user.photo_url || userPhoto || currentPhoto || registeredUser?.photo_url;

console.log('Photo finale:', finalPhoto);

// 3. Forcer l'affichage si une photo existe
if (finalPhoto && finalPhoto !== 'assets/default-avatar.svg') {
    const imgElements = document.querySelectorAll('img[alt="Photo de profil"]');
    imgElements.forEach(img => {
        img.src = finalPhoto;
        console.log('Photo appliquée à:', img);
    });
    
    console.log('✅ Photo appliquée avec succès !');
} else {
    console.log('❌ Aucune photo trouvée');
}

console.log('=== FIN TEST ===');