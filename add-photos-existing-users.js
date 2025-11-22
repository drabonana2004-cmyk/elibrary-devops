// Script pour ajouter des photos aux comptes existants
// Exécuter dans la console du navigateur (F12)

console.log('=== AJOUT PHOTOS COMPTES EXISTANTS ===');

// 1. Récupérer tous les utilisateurs enregistrés
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

console.log('Utilisateurs trouvés:', registeredUsers.length);
console.log('Utilisateur actuel:', currentUser);

// 2. Fonction pour créer une photo avec initiales
function createUserPhoto(name, email) {
    // Utiliser un service d'avatar en ligne
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=4B7688&color=fff&size=200&font-size=0.6&rounded=true`;
}

// 3. Ajouter des photos aux utilisateurs existants
registeredUsers.forEach((user, index) => {
    if (!user.photo_url || user.photo_url === 'assets/default-avatar.svg') {
        const photoUrl = createUserPhoto(user.name, user.email);
        user.photo_url = photoUrl;
        
        // Sauvegarder aussi séparément
        localStorage.setItem('userPhoto_' + user.email, photoUrl);
        
        console.log(`Photo ajoutée pour ${user.name}: ${photoUrl}`);
    } else {
        console.log(`${user.name} a déjà une photo`);
    }
});

// 4. Sauvegarder les utilisateurs mis à jour
localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

// 5. Mettre à jour l'utilisateur actuel si nécessaire
if (currentUser.email) {
    const updatedCurrentUser = registeredUsers.find(u => u.email === currentUser.email);
    if (updatedCurrentUser && updatedCurrentUser.photo_url) {
        currentUser.photo_url = updatedCurrentUser.photo_url;
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('userPhoto_' + currentUser.email, updatedCurrentUser.photo_url);
        console.log(`Photo mise à jour pour l'utilisateur actuel: ${currentUser.name}`);
    }
}

// 6. Créer quelques utilisateurs de test avec photos si aucun n'existe
if (registeredUsers.length === 0) {
    const testUsers = [
        { id: 100, name: 'DRABO', email: 'drabo@test.com', password: 'test123', role: 'user', status: 'approved' },
        { id: 101, name: 'Marie Dupont', email: 'marie@test.com', password: 'test123', role: 'user', status: 'approved' },
        { id: 102, name: 'Jean Martin', email: 'jean@test.com', password: 'test123', role: 'user', status: 'pending' }
    ];
    
    testUsers.forEach(user => {
        user.photo_url = createUserPhoto(user.name, user.email);
        localStorage.setItem('userPhoto_' + user.email, user.photo_url);
        registeredUsers.push(user);
        console.log(`Utilisateur de test créé: ${user.name} avec photo`);
    });
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

console.log('=== PHOTOS AJOUTÉES AVEC SUCCÈS ===');
console.log('Rechargement de la page dans 2 secondes...');

// 7. Recharger la page pour voir les changements
setTimeout(() => {
    location.reload();
}, 2000);