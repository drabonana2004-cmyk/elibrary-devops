// Injection immédiate dans la page pour masquer les quantités
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Masquer les quantités pour les utilisateurs non-admin */
        body:not(.admin-user) .quantity-display,
        body:not(.admin-user) *:contains("5/5"),
        body:not(.admin-user) *:contains("6/6"),
        body:not(.admin-user) *:contains("2/4"),
        body:not(.admin-user) *:contains("3/3"),
        body:not(.admin-user) *:contains("4/4"),
        body:not(.admin-user) *:contains("8/8"),
        body:not(.admin-user) *:contains("2/2") {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Vérifier le rôle utilisateur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
        // Masquer immédiatement tous les éléments contenant des quantités
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (/\d+\/\d+/.test(node.textContent)) {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            if (parent && parent.textContent.includes('/')) {
                parent.style.display = 'none';
            }
        });
    } else {
        document.body.classList.add('admin-user');
    }
});

// Exécuter immédiatement si le DOM est déjà chargé
if (document.readyState !== 'loading') {
    document.dispatchEvent(new Event('DOMContentLoaded'));
}