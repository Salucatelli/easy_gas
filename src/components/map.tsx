import { Station } from "@/services/stationStorage";

export default function createMapHTML(latitude: number, longitude: number, stations: Station[]) {
    // Converte os postos para JSON válido
    const stationsJSON = JSON.stringify(stations).replace(/</g, '\\u003c');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <!-- CSS do Leaflet -->
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />

            <style>
                html, body, #map {
                    height: 100%;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }
                .station-marker {
                    width: 100%;
                    height: 100%;
                    background: #0066FF;
                    border: 3px solid white;
                    box-sizing: border-box;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .station-marker svg {
                    width: 55%;
                    height: 55%;
                    transform: rotate(45deg);
                }

                /* Popup personalizado dos postos */
                .station-popup {
                    width: 230px;
                    padding: 4px;
                    font-family: Arial, sans-serif;
                    color: #FFFFFF;
                }

                .station-popup-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }

                .station-popup-icon {
                    width: 36px;
                    height: 36px;
                    min-width: 36px;
                    border-radius: 18px;
                    background: #00E676;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #003399;
                    font-size: 19px;
                }

                .station-popup-name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #FFFFFF;
                    margin: 0;
                }

                .station-popup-address {
                    color: #B0C4DE;
                    font-size: 12px;
                    margin: 4px 0 12px;
                    line-height: 17px;
                }

                .station-popup-price {
                    color: #FFFFFF;
                    font-size: 13px;
                    margin-bottom: 12px;
                }

                .station-popup-price strong {
                    color: #00E676;
                }

                .station-popup-button {
                    width: 100%;
                    border: none;
                    border-radius: 10px;
                    padding: 11px;
                    background: #00E676;
                    color: #003399;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .leaflet-popup-content-wrapper {
                    background: #003399;
                    border-radius: 16px;
                    padding: 5px;
                }

                .leaflet-popup-tip {
                    background: #003399;
                }

                .leaflet-popup-content {
                    margin: 12px;
                }
            </style>
        </head>

        <body>
            <div id="map"></div>

            <!-- JavaScript do Leaflet -->
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

            <script>
                let userMarker = null;
                let userCircle = null;

                // Verifica se o Leaflet foi carregado
                if (typeof L === 'undefined') {
                    document.body.innerHTML = 'Erro ao carregar o Leaflet.';
                } else {

                    const customStationIcon = L.divIcon({
                        className: '',
                        html:
                            '<div class="station-marker">' +
                                '<svg viewBox="0 0 24 24" fill="none" ' +
                                    'stroke="white" stroke-width="2" ' +
                                    'stroke-linecap="round" stroke-linejoin="round">' +
                                    '<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/>' +
                                    '<path d="M2 22h14"/>' +
                                    '<path d="M7 7h4v5H7z"/>' +
                                    '<path d="M15 8h2l3 3v6a2 2 0 0 1-4 0v-4"/>' +
                                '</svg>' +
                            '</div>',
                        iconSize: [48, 48],
                        iconAnchor: [24, 48],
                        popupAnchor: [0, -45]
                    });
                    const latitude = ${latitude};
                    const longitude = ${longitude};

                    // Postos recebidos do React Native
                    const stations = ${stationsJSON};

                    // Inicializa o mapa
                    const map = L.map('map', {
                        zoomControl: false
                    }).setView([latitude, longitude], 16);

                    map.on('zoomend', updateMarkerSize);

                    // Camada do OpenStreetMap
                    L.tileLayer(
                        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        {
                            maxZoom: 19,
                            attribution: '&copy; OpenStreetMap contributors'
                        }
                    ).addTo(map);

                    // Marcador da localização do usuário
                    window.userMarker = L.circleMarker([latitude, longitude], {
                        radius: 9,
                        color: '#ffffff',
                        weight: 3,
                        fillColor: '#1769e0',
                        fillOpacity: 1
                    })
                    .addTo(map)
                    .bindPopup('Você está aqui');

                    // Adiciona os postos cadastrados
                    stations.forEach(posto => {

                        if (
                            typeof posto.latitude !== 'number' ||
                            typeof posto.longitude !== 'number' ||
                            !Number.isFinite(posto.latitude) ||
                            !Number.isFinite(posto.longitude)
                        ) {
                            return;
                        }

                        const marker = L.marker(
                            [posto.latitude, posto.longitude],
                            {
                                icon: customStationIcon,
                                isStation: true
                            }
                        ).addTo(map);

                       // Monta o popup personalizado
                        const popup = document.createElement('div');
                        popup.className = 'station-popup';

                        // Cabeçalho
                        const header = document.createElement('div');
                        header.className = 'station-popup-header';

                        const icon = document.createElement('div');
                        icon.className = 'station-popup-icon';
                        icon.textContent = '⛽';

                        const name = document.createElement('h3');
                        name.className = 'station-popup-name';
                        name.textContent = posto.name || 'Posto sem nome';

                        header.appendChild(icon);
                        header.appendChild(name);

                        // Endereço
                        const address = document.createElement('p');
                        address.className = 'station-popup-address';
                        address.textContent = posto.address || 'Endereço não informado';

                        // Preços
                        const prices = document.createElement('div');
                        prices.className = 'station-popup-price';

                        const gasoline = document.createElement('div');
                        gasoline.innerHTML = 'Gasolina: <strong>R$ ' +
                            (posto.prices?.gasoline || '--') + '</strong>';

                        const ethanol = document.createElement('div');
                        ethanol.innerHTML = 'Etanol: <strong>R$ ' +
                            (posto.prices?.ethanol || '--') + '</strong>';

                        const diesel = document.createElement('div');
                        diesel.innerHTML = 'Diesel: <strong>R$ ' +
                            (posto.prices?.diesel || '--') + '</strong>';

                        prices.appendChild(gasoline);
                        prices.appendChild(ethanol);
                        prices.appendChild(diesel);

                        // Botão
                        const goToStation = document.createElement('button');
                        goToStation.className = 'station-popup-button';
                        goToStation.textContent = 'Ir para o posto';

                        goToStation.addEventListener('click', function() {
                            map.setView(
                                [posto.latitude, posto.longitude],
                                18
                            );

                            marker.closePopup();
                        });

                        // Monta o popup
                        popup.appendChild(header);
                        popup.appendChild(address);
                        popup.appendChild(prices);
                        popup.appendChild(goToStation);

                        marker.bindPopup(popup);
                    });

                    function updateMarkerSize() {
                        const zoom = map.getZoom();

                        // Zoom 15 = tamanho normal
                        const scale = Math.max(
                            0.4,
                            Math.min(1.2, Math.pow(1.15, zoom - 15))
                        );

                        const size = 32 * scale;

                        const newIcon = L.divIcon({
                            className: '',
                            html:
                                '<div class="station-marker">' +
                                    '<svg viewBox="0 0 24 24" fill="none" ' +
                                        'stroke="white" stroke-width="2" ' +
                                        'stroke-linecap="round" stroke-linejoin="round">' +
                                        '<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/>' +
                                        '<path d="M2 22h14"/>' +
                                        '<path d="M7 7h4v5H7z"/>' +
                                        '<path d="M15 8h2l3 3v6a2 2 0 0 1-4 0v-4"/>' +
                                    '</svg>' +
                                '</div>',
                            iconSize: [size, size],
                            iconAnchor: [size / 2, size],
                            popupAnchor: [0, -size + 3]
                        });

                        map.eachLayer((layer) => {
                            if (layer instanceof L.Marker && layer.options.isStation) {
                                layer.setIcon(newIcon);
                            }
                        });
                    }

                    // Disponibiliza a função para atualizações de localização
                    window.updateUserLocation = function(latitude, longitude) {
                        const position = [latitude, longitude];

                        if (window.userMarker) {
                            map.removeLayer(window.userMarker);
                        }

                        if (window.userCircle) {
                            map.removeLayer(window.userCircle);
                        }

                        window.userCircle = L.circle(position, {
                            radius: 30,
                            color: '#1769e0',
                            fillColor: '#1769e0',
                            fillOpacity: 0.12,
                            weight: 1
                        }).addTo(map);

                        window.userMarker = L.circleMarker(position, {
                            radius: 9,
                            color: '#ffffff',
                            weight: 3,
                            fillColor: '#1769e0',
                            fillOpacity: 1
                        }).addTo(map);

                        window.userMarker.bindPopup('Você está aqui');

                        map.setView(position, 16);
                    };

                    updateMarkerSize();
                    window.mapReady = true;
                    

                    console.log('Mapa carregado!');
                    console.log('Postos recebidos:', stations.length);
                }
            </script>
        </body>
        </html>
    `;
}