// Script pour cacher immédiatement les quantités pour les utilisateurs non-admin
(function() {
    console.log('🔧 Script de masquage des quantités démarré...');
    
    function hideQuantitiesForUsers() {
        // Vérifier si l'utilisateur est admin
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isAdmin = user.role === 'admin';
        
        console.log('👤 Utilisateur:', user.name, '| Admin:', isAdmin);
        
        if (isAdmin) {
            console.log('✅ Utilisateur admin - quantités conservées');
            return;
        }
        
        // Cacher tous les éléments contenant des quantités
        const quantitySelectors = [
            'span:contains("/")',
            '.badge:contains("/")',
            '*:contains("5/5")',
            '*:contains("6/6")',
            '*:contains("2/4")',
            '*:contains("3/3")',
            '*:contains("4/4")',
            '*:contains("8/8")',
            '*:contains("2/2")'
        ];
        
        // Fonction pour trouver et cacher les éléments avec quantités
        function hideQuantityElements() {
            const allElements = document.querySelectorAll('*');
            let hiddenCount = 0;
            
            allElements.forEach(element => {
                const text = element.textContent || '';
                
                // Chercher les patterns de quantité (chiffre/chiffre)
                if (/\d+\/\d+/.test(text) && !element.classList.contains('quantity-hidden')) {
                    // Vérifier si c'est dans un badge ou span de disponibilité
                    if (element.classList.contains('badge') || element.tagName === 'SPAN') {
                        // Remplacer par version simple
                        if (text.includes('Disponible')) {
                            element.textContent = 'Disponible';
                        } else if (text.includes('Indisponible')) {
                            element.textContent = 'Indisponible';
                        } else {
                            element.style.display = 'none';
                        }
                        element.classList.add('quantity-hidden');
                        hiddenCount++;
                    }
                }
            });
            
            console.log(`🔒 ${hiddenCount} éléments de quantité masqués`);
        }
        
        // Exécuter immédiatement
        hideQuantityElements();
        
        // Observer les changements DOM
        const observer = new MutationObserver(() => {
            hideQuantityElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observer DOM activé pour masquer les nouvelles quantités');
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideQuantitiesForUsers);
    } else {
        hideQuantitiesForUsers();
    }
    
    // Réexécuter après un délai pour s'assurer que tout est masqué
    setTimeout(hideQuantitiesForUsers, 1000);
    setTimeout(hideQuantitiesForUsers, 3000);
})();