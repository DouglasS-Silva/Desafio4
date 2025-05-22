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

// No final do arquivo scripts.js

// Inicializar mapa
function initMap() {
    const map = L.map('map').setView([-15.7889, -47.8798], 4); // Centro do Brasil
    
    // Adicionar camada do mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adicionar marcadores de exemplo (dados simulados)
    const markers = [
        {
            coords: [-3.10719, -60.0261],
            title: "Manaus - Desmatamento",
            type: "deforestation"
        },
        {
            coords: [-15.6014, -56.0979],
            title: "Cuiabá - Queimadas",
            type: "fire"
        },
        {
            coords: [-23.5505, -46.6333],
            title: "São Paulo - Poluição",
            type: "pollution"
        }
    ];

    // Ícones personalizados
    const iconColors = {
        deforestation: 'orange',
        fire: 'red',
        pollution: 'gray'
    };

    markers.forEach(marker => {
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${iconColors[marker.type]}; 
                   width: 12px; height: 12px; border-radius: 50%; 
                   border: 2px solid white;"></div>`,
            iconSize: [16, 16]
        });

        L.marker(marker.coords, { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${marker.title}</b><br>Área com alerta ambiental`);
    });
}

// Chamar a função quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    initMap(); // Adicione esta linha
});