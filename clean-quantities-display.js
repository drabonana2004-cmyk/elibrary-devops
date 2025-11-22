// Script pour nettoyer l'affichage des quantités
// Exécuter dans la console du navigateur (F12)

console.log('=== NETTOYAGE AFFICHAGE QUANTITÉS ===');

// 1. Vérifier le rôle de l'utilisateur
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Utilisateur actuel:', currentUser);
console.log('Rôle:', currentUser.role);

// 2. Si c'est un utilisateur normal, masquer toutes les quantités
if (currentUser.role !== 'admin') {
    console.log('Utilisateur normal détecté - Masquage des quantités');
    
    // Masquer tous les éléments contenant des quantités
    const quantityElements = document.querySelectorAll('*');
    quantityElements.forEach(element => {
        if (element.textContent && element.textContent.match(/\d+\/\d+/)) {
            console.log('Élément avec quantité trouvé:', element.textContent);
            
            // Si c'est juste du texte avec des quantités, le masquer
            if (element.children.length === 0) {
                element.style.display = 'none';
            }
            // Si c'est un élément parent, masquer juste la partie quantité
            else {
                const text = element.textContent;
                const newText = text.replace(/\d+\/\d+/g, '');
                if (newText !== text) {
                    element.innerHTML = element.innerHTML.replace(/\d+\/\d+/g, '');
                }
            }
        }
    });
    
    // Masquer spécifiquement les badges avec quantités
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (badge.textContent && badge.textContent.match(/\d+\/\d+/)) {
            badge.textContent = badge.textContent.includes('Disponible') ? 'Disponible' : 'Indisponible';
        }
    });
    
    console.log('✅ Quantités masquées pour utilisateur normal');
} else {
    console.log('Administrateur détecté - Quantités conservées');
}

// 3. Forcer le rechargement des styles
const style = document.createElement('style');
style.textContent = `
    .user-only-hide-quantity .badge:contains('/') {
        display: none !important;
    }
`;
document.head.appendChild(style);

console.log('=== NETTOYAGE TERMINÉ ===');