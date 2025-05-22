document.addEventListener('DOMContentLoaded', function() {
    const stateFilter = document.getElementById('state-filter');
    const refreshBtn = document.getElementById('refresh-map');
    const mapLoading = document.getElementById('map-loading');
    
    // Inicializações
    initStateFilter();
    initMap();
    loadDashboardData();
    
    // Event Listeners
    refreshBtn.addEventListener('click', function() {
        const selectedState = stateFilter.value;
        updateMap(selectedState);
    });
    
    // Navegação entre seções
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Preenche o seletor de estados
function initStateFilter() {
    const states = [
        {code: 'AC', name: 'Acre'}, {code: 'AL', name: 'Alagoas'}, 
        {code: 'AP', name: 'Amapá'}, {code: 'AM', name: 'Amazonas'},
        // ... (adicionar todos os estados)
        {code: 'TO', name: 'Tocantins'}
    ];
    
    const select = document.getElementById('state-filter');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.code;
        option.textContent = state.name;
        select.appendChild(option);
    });
}

// Mapa Leaflet
let map;
let markers = [];

function initMap() {
    map = L.map('map').setView([-15.7889, -47.8798], 4);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    updateMap('all');
}

async function updateMap(state) {
    const loading = document.getElementById('map-loading');
    loading.style.display = 'flex';
    
    try {
        // Limpa marcadores antigos
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // API de Queimadas (INPE)
        let fires = [];
        if (state === 'all') {
            const response = await fetch('https://queimadas.dgi.inpe.br/api/focos/?pais_id=33');
            fires = await response.json();
        } else {
            const response = await fetch(`https://queimadas.dgi.inpe.br/api/focos/?pais_id=33&estado_id=${state}`);
            fires = await response.json();
        }
        
        // Processa os dados
        fires.forEach(fire => {
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: red; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [16, 16]
            });
            
            const marker = L.marker([fire.latitude, fire.longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>${fire.municipio} - ${fire.estado}</b><br>Foco de queimada detectado`);
                
            markers.push(marker);
        });
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// Atualiza os cards do dashboard
async function loadDashboardData() {
    try {
        // API de Desmatamento (simulado - INPE não tem API pública direta - talvez precise tirar ou substituir)
        const deforestation = await fetchDeforestationData();
        document.querySelector('.card:nth-child(1) .card-value').textContent = 
            `${deforestation.total.toLocaleString('pt-BR')} km²`;
        document.querySelector('.card:nth-child(1) .card-trend').textContent = 
            `${deforestation.trend > 0 ? '+' : ''}${deforestation.trend}% em relação ao ano anterior`;
        
        // API de Qualidade do Ar (SIMULAÇÃO)
        const airQuality = await fetchAirQualityData();
        document.querySelector('.card:nth-child(3) .card-value').textContent = 
            `${airQuality.quality} (${airQuality.index})`;
        document.querySelector('.card:nth-child(3) .card-trend').textContent = 
            `${airQuality.trend > 0 ? '+' : ''}${airQuality.trend}% em relação ao mês anterior`;
            
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Funções auxiliares para simular APIs
async function fetchDeforestationData() {
    // Simulando resposta da API
    return {
        total: Math.floor(Math.random() * 15000) + 5000,
        trend: (Math.random() * 10 - 5).toFixed(1)
    };
}

async function fetchAirQualityData() {
    const levels = ['Boa', 'Moderada', 'Ruim', 'Muito Ruim', 'Péssima'];
    return {
        quality: levels[Math.floor(Math.random() * levels.length)],
        index: Math.floor(Math.random() * 200) + 1,
        trend: (Math.random() * 10 - 5).toFixed(1)
    };
}
