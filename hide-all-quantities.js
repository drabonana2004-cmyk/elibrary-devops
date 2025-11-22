// Masquer toutes les quantités pour TOUS les utilisateurs non-admin
(function() {
    function hideQuantities() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin') return;
        
        document.querySelectorAll('*').forEach(el => {
            if (el.textContent && /\d+\/\d+/.test(el.textContent)) {
                if (el.textContent.includes('Disponible')) {
                    el.textContent = 'Disponible';
                } else if (el.textContent.includes('Indisponible')) {
                    el.textContent = 'Indisponible';
                } else {
                    el.style.display = 'none';
                }
            }
        });
    }
    
    hideQuantities();
    setInterval(hideQuantities, 500);
})();