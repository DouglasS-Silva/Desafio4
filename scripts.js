document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
        
            navLinks.forEach(l => l.classList.remove('active'));
            
            
            this.classList.add('active');
            
        
            console.log('Navegar para:', this.textContent.trim());
        });
    });
    
    // Simular dados atualizados
    setInterval(updateDashboardData, 5000);
});

function updateDashboardData() {
    // Simular atualização de dados
    const cards = document.querySelectorAll('.card-value');
    
    cards.forEach(card => {
        const randomChange = (Math.random() * 5 - 2.5).toFixed(1);
        const currentValue = card.textContent;
        
        // Simular pequenas variações nos valores
        if (currentValue.includes('km²')) {
            const value = parseFloat(currentValue.replace(' km²', '').replace('.', ''));
            const newValue = (value * (1 + randomChange/100)).toFixed(0);
            card.textContent = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' km²';
        } else if (currentValue.includes('focos')) {
            const value = parseInt(currentValue.replace(' focos', '').replace('.', ''));
            const newValue = (value * (1 + randomChange/100)).toFixed(0);
            card.textContent = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' focos';
        }
    });
    
    console.log('Dados atualizados:', new Date().toLocaleTimeString());
}