import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';

import { getStations, Station } from '../services/stationStorage';
import NearStationsModal from "./nearStationsModal"
import createMapHTML from './map';

function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

async function loadStations() {
    const stations = await getStations();

    console.log('Postos salvos:', stations);
}


export default function MapInterface() {
    const [stationsModalVisible, setStationsModalVisible] = useState(false);
    const [nearbyStations, setNearbyStations] = useState<
        (Station & { distance: number })[]
    >([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    const [stations, setStations] = useState<Station[]>([])

    const webViewRef = useRef<WebView>(null);

    const router = useRouter();
    const [search, setSearch] = useState('');

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [loading, setLoading] = useState(true);

    // function createMapHTML(latitude: number, longitude: number) {
    //     // Converte os postos para JSON válido
    //     const stationsJSON = JSON.stringify(stations).replace(/</g, '\\u003c');

    //     return `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">

    //         <!-- CSS do Leaflet -->
    //         <link
    //             rel="stylesheet"
    //             href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    //         />

    //         <style>
    //             html, body, #map {
    //                 height: 100%;
    //                 width: 100%;
    //                 margin: 0;
    //                 padding: 0;
    //             }
    //             .station-marker {
    //                 width: 100%;
    //                 height: 100%;
    //                 background: #0066FF;
    //                 border: 3px solid white;
    //                 box-sizing: border-box;
    //                 border-radius: 50% 50% 50% 0;
    //                 transform: rotate(-45deg);
    //                 box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    //                 display: flex;
    //                 align-items: center;
    //                 justify-content: center;
    //             }

    //             .station-marker svg {
    //                 width: 55%;
    //                 height: 55%;
    //                 transform: rotate(45deg);
    //             }

    //             /* Popup personalizado dos postos */
    //             .station-popup {
    //                 width: 230px;
    //                 padding: 4px;
    //                 font-family: Arial, sans-serif;
    //                 color: #FFFFFF;
    //             }

    //             .station-popup-header {
    //                 display: flex;
    //                 align-items: center;
    //                 gap: 10px;
    //                 margin-bottom: 12px;
    //             }

    //             .station-popup-icon {
    //                 width: 36px;
    //                 height: 36px;
    //                 min-width: 36px;
    //                 border-radius: 18px;
    //                 background: #00E676;
    //                 display: flex;
    //                 align-items: center;
    //                 justify-content: center;
    //                 color: #003399;
    //                 font-size: 19px;
    //             }

    //             .station-popup-name {
    //                 font-size: 16px;
    //                 font-weight: bold;
    //                 color: #FFFFFF;
    //                 margin: 0;
    //             }

    //             .station-popup-address {
    //                 color: #B0C4DE;
    //                 font-size: 12px;
    //                 margin: 4px 0 12px;
    //                 line-height: 17px;
    //             }

    //             .station-popup-price {
    //                 color: #FFFFFF;
    //                 font-size: 13px;
    //                 margin-bottom: 12px;
    //             }

    //             .station-popup-price strong {
    //                 color: #00E676;
    //             }

    //             .station-popup-button {
    //                 width: 100%;
    //                 border: none;
    //                 border-radius: 10px;
    //                 padding: 11px;
    //                 background: #00E676;
    //                 color: #003399;
    //                 font-size: 14px;
    //                 font-weight: bold;
    //                 cursor: pointer;
    //             }

    //             .leaflet-popup-content-wrapper {
    //                 background: #003399;
    //                 border-radius: 16px;
    //                 padding: 5px;
    //             }

    //             .leaflet-popup-tip {
    //                 background: #003399;
    //             }

    //             .leaflet-popup-content {
    //                 margin: 12px;
    //             }
    //         </style>
    //     </head>

    //     <body>
    //         <div id="map"></div>

    //         <!-- JavaScript do Leaflet -->
    //         <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    //         <script>
    //             // Verifica se o Leaflet foi carregado
    //             if (typeof L === 'undefined') {
    //                 document.body.innerHTML = 'Erro ao carregar o Leaflet.';
    //             } else {

    //                 const customStationIcon = L.divIcon({
    //                     className: '',
    //                     html:
    //                         '<div class="station-marker">' +
    //                             '<svg viewBox="0 0 24 24" fill="none" ' +
    //                                 'stroke="white" stroke-width="2" ' +
    //                                 'stroke-linecap="round" stroke-linejoin="round">' +
    //                                 '<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/>' +
    //                                 '<path d="M2 22h14"/>' +
    //                                 '<path d="M7 7h4v5H7z"/>' +
    //                                 '<path d="M15 8h2l3 3v6a2 2 0 0 1-4 0v-4"/>' +
    //                             '</svg>' +
    //                         '</div>',
    //                     iconSize: [48, 48],
    //                     iconAnchor: [24, 48],
    //                     popupAnchor: [0, -45]
    //                 });
    //                 const latitude = ${latitude};
    //                 const longitude = ${longitude};

    //                 // Postos recebidos do React Native
    //                 const stations = ${stationsJSON};

    //                 // Inicializa o mapa
    //                 const map = L.map('map', {
    //                     zoomControl: false
    //                 }).setView([latitude, longitude], 16);

    //                 map.on('zoomend', updateMarkerSize);

    //                 // Camada do OpenStreetMap
    //                 L.tileLayer(
    //                     'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //                     {
    //                         maxZoom: 19,
    //                         attribution: '&copy; OpenStreetMap contributors'
    //                     }
    //                 ).addTo(map);

    //                 // Marcador da localização do usuário
    //                 L.circleMarker([latitude, longitude], {
    //                     radius: 9,
    //                     color: '#ffffff',
    //                     weight: 3,
    //                     fillColor: '#1769e0',
    //                     fillOpacity: 1
    //                 })
    //                 .addTo(map)
    //                 .bindPopup('Você está aqui');

    //                 // Adiciona os postos cadastrados
    //                 stations.forEach(posto => {

    //                     if (
    //                         typeof posto.latitude !== 'number' ||
    //                         typeof posto.longitude !== 'number' ||
    //                         !Number.isFinite(posto.latitude) ||
    //                         !Number.isFinite(posto.longitude)
    //                     ) {
    //                         return;
    //                     }

    //                     const marker = L.marker(
    //                         [posto.latitude, posto.longitude],
    //                         {
    //                             icon: customStationIcon,
    //                             isStation: true
    //                         }
    //                     ).addTo(map);

    //                    // Monta o popup personalizado
    //                     const popup = document.createElement('div');
    //                     popup.className = 'station-popup';

    //                     // Cabeçalho
    //                     const header = document.createElement('div');
    //                     header.className = 'station-popup-header';

    //                     const icon = document.createElement('div');
    //                     icon.className = 'station-popup-icon';
    //                     icon.textContent = '⛽';

    //                     const name = document.createElement('h3');
    //                     name.className = 'station-popup-name';
    //                     name.textContent = posto.name || 'Posto sem nome';

    //                     header.appendChild(icon);
    //                     header.appendChild(name);

    //                     // Endereço
    //                     const address = document.createElement('p');
    //                     address.className = 'station-popup-address';
    //                     address.textContent = posto.address || 'Endereço não informado';

    //                     // Preços
    //                     const prices = document.createElement('div');
    //                     prices.className = 'station-popup-price';

    //                     const gasoline = document.createElement('div');
    //                     gasoline.innerHTML = 'Gasolina: <strong>R$ ' +
    //                         (posto.prices?.gasoline || '--') + '</strong>';

    //                     const ethanol = document.createElement('div');
    //                     ethanol.innerHTML = 'Etanol: <strong>R$ ' +
    //                         (posto.prices?.ethanol || '--') + '</strong>';

    //                     const diesel = document.createElement('div');
    //                     diesel.innerHTML = 'Diesel: <strong>R$ ' +
    //                         (posto.prices?.diesel || '--') + '</strong>';

    //                     prices.appendChild(gasoline);
    //                     prices.appendChild(ethanol);
    //                     prices.appendChild(diesel);

    //                     // Botão
    //                     const goToStation = document.createElement('button');
    //                     goToStation.className = 'station-popup-button';
    //                     goToStation.textContent = 'Ir para o posto';

    //                     goToStation.addEventListener('click', function() {
    //                         map.setView(
    //                             [posto.latitude, posto.longitude],
    //                             18
    //                         );

    //                         marker.closePopup();
    //                     });

    //                     // Monta o popup
    //                     popup.appendChild(header);
    //                     popup.appendChild(address);
    //                     popup.appendChild(prices);
    //                     popup.appendChild(goToStation);

    //                     marker.bindPopup(popup);
    //                 });

    //                 function updateMarkerSize() {
    //                     const zoom = map.getZoom();

    //                     // Zoom 15 = tamanho normal
    //                     const scale = Math.max(
    //                         0.4,
    //                         Math.min(1.2, Math.pow(1.15, zoom - 15))
    //                     );

    //                     const size = 32 * scale;

    //                     const newIcon = L.divIcon({
    //                         className: '',
    //                         html:
    //                             '<div class="station-marker">' +
    //                                 '<svg viewBox="0 0 24 24" fill="none" ' +
    //                                     'stroke="white" stroke-width="2" ' +
    //                                     'stroke-linecap="round" stroke-linejoin="round">' +
    //                                     '<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/>' +
    //                                     '<path d="M2 22h14"/>' +
    //                                     '<path d="M7 7h4v5H7z"/>' +
    //                                     '<path d="M15 8h2l3 3v6a2 2 0 0 1-4 0v-4"/>' +
    //                                 '</svg>' +
    //                             '</div>',
    //                         iconSize: [size, size],
    //                         iconAnchor: [size / 2, size],
    //                         popupAnchor: [0, -size + 3]
    //                     });

    //                     map.eachLayer((layer) => {
    //                         if (layer instanceof L.Marker && layer.options.isStation) {
    //                             layer.setIcon(newIcon);
    //                         }
    //                     });
    //                 }

    //                 // Disponibiliza a função para atualizações de localização
    //                 window.updateUserLocation = function(latitude, longitude) {
    //                     const position = [latitude, longitude];

    //                     if (window.userMarker) {
    //                         map.removeLayer(window.userMarker);
    //                     }

    //                     if (window.userCircle) {
    //                         map.removeLayer(window.userCircle);
    //                     }

    //                     window.userCircle = L.circle(position, {
    //                         radius: 30,
    //                         color: '#1769e0',
    //                         fillColor: '#1769e0',
    //                         fillOpacity: 0.12,
    //                         weight: 1
    //                     }).addTo(map);

    //                     window.userMarker = L.circleMarker(position, {
    //                         radius: 9,
    //                         color: '#ffffff',
    //                         weight: 3,
    //                         fillColor: '#1769e0',
    //                         fillOpacity: 1
    //                     }).addTo(map);

    //                     window.userMarker.bindPopup('Você está aqui');

    //                     map.setView(position, 16);
    //                 };

    //                 updateMarkerSize();
    //                 window.mapReady = true;


    //                 console.log('Mapa carregado!');
    //                 console.log('Postos recebidos:', stations.length);
    //             }
    //         </script>
    //     </body>
    //     </html>
    // `;
    // }


    useFocusEffect(
        useCallback(() => {
            async function loadStations() {
                try {
                    setLoadingStations(true);

                    const savedStations = await getStations();

                    setStations(savedStations);
                } catch (error) {
                    console.error('Erro ao carregar postos:', error);
                } finally {
                    setLoadingStations(false);
                }
            }

            loadStations();
        }, [])
    );

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;
        let active = true;

        async function startTracking() {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted' || !active) {
                    return;
                }

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5,
                        timeInterval: 2000,
                    },
                    (position) => {
                        if (!active) return;

                        const { latitude, longitude } = position.coords;

                        webViewRef.current?.injectJavaScript(`
            updateUserLocation(${latitude}, ${longitude});
            true;
          `);
                    }
                );
            } catch (error) {
                console.error('Erro ao acompanhar localização:', error);
            }
        }

        startTracking();

        async function getUserLocation() {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    return;
                }

                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            } catch (error) {
                console.error('Erro ao obter localização:', error);
            } finally {
                setLoading(false);
            }
        }

        getUserLocation();

        return () => {
            active = false;
            subscription?.remove();
        };
    }, []);

    const insets = useSafeAreaInsets();

    function handleFindOnMap(station: Station) {
        setSelectedStation(station);

        console.log('Posto selecionado:', station);

        setStationsModalVisible(false);

        // Futuramente:
        // Centralizar o mapa nas coordenadas do posto.
        // Adicionar ou destacar o marcador no Leaflet.
    }

    function handleSearch() {
        if (!search.trim()) return;

        // Depois podemos enviar a pesquisa ao Leaflet
        // ou consultar uma API de endereços.
        Alert.alert('Pesquisar', `Busca por: ${search}`);
    }

    function handleFilters() {
        Alert.alert('Filtros', 'Aqui ficarão os filtros de combustível.');
    }

    async function handleStations() {
        try {
            setStationsModalVisible(true);
            setLoadingStations(true);

            // Solicita permissão de localização
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Localização necessária',
                    'Permita o acesso à localização para encontrar os postos próximos.'
                );

                setStationsModalVisible(false);
                return;
            }

            // Obtém localização atual
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = position.coords;

            // Recupera postos salvos
            const stations = await getStations();

            // Calcula distância e ordena os postos
            const sortedStations = stations
                .filter(
                    station =>
                        station.latitude !== null &&
                        station.longitude !== null
                )
                .map(station => ({
                    ...station,
                    distance: calculateDistance(
                        latitude,
                        longitude,
                        station.latitude!,
                        station.longitude!
                    ),
                }))
                .sort((a, b) => a.distance - b.distance);

            setNearbyStations(sortedStations);

        } catch (error) {
            console.error('Erro ao buscar postos:', error);

            Alert.alert(
                'Erro',
                'Não foi possível carregar os postos próximos.'
            );

            setStationsModalVisible(false);
        } finally {
            setLoadingStations(false);
        }
    }

    async function handleLocation() {
    try {
        const { status } =
            await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permissão necessária',
                'Permita o acesso à localização para encontrar sua posição no mapa.'
            );
            return;
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;

        const script = `
            (function() {
                if (window.mapReady && typeof window.updateUserLocation === 'function') {
                    window.updateUserLocation(${latitude}, ${longitude});
                } else {
                    console.log('Mapa ainda não está pronto.');
                }
            })();
            true;
        `;

        webViewRef.current?.injectJavaScript(script);

    } catch (error) {
        console.error('Erro ao obter localização:', error);

        Alert.alert(
            'Erro',
            'Não foi possível obter sua localização. Verifique se o GPS está ativado.'
        );
    }
}


    return (
        <View style={styles.container}>
            {/* Mapa como camada de fundo */}
            {location && (
                <WebView
                    originWhitelist={['*']}
                    source={{
                        html: createMapHTML(
                            location.latitude,
                            location.longitude,
                            stations
                        ),
                    }}
                    style={{ flex: 1 }}
                />
            )}

            {/* Barra de pesquisa no topo */}
            <View style={[styles.searchBar, { top: insets.top }]}>
                <Text style={styles.searchIcon}>⌕</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar posto ou endereço"
                    placeholderTextColor="#777"
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />

                <Pressable
                    style={styles.searchAction}
                    onPress={handleFilters}
                    accessibilityLabel="Abrir filtros"
                >
                    <Text style={styles.filterIcon}>☷</Text>
                </Pressable>
            </View>

            {/* Botões flutuantes à direita */}
            <View style={styles.rightControls}>
                <Pressable
                    style={styles.floatingButton}
                    onPress={() => router.push("/add_station")}
                    accessibilityLabel="Adicionar um Posto"
                >
                    <Text style={styles.buttonIcon}><Ionicons name="add" size={32} /></Text>
                </Pressable>

                <Pressable
                    style={styles.floatingButton}
                    onPress={() => router.push("/settings")}
                    accessibilityLabel="Configurações"
                >
                    <Text style={styles.buttonIcon}>⚙</Text>
                </Pressable>
                <Pressable
                    style={styles.floatingButton}
                    onPress={handleLocation}
                    accessibilityLabel="Minha localização"
                >
                    <Text style={styles.buttonIcon}>◎</Text>
                </Pressable>
            </View>

            {/* Botão no canto inferior esquerdo */}
            <Pressable
                style={styles.stationsButton}
                onPress={handleStations}
            >
                <Text style={styles.stationsIcon}>☰</Text>
                <Text style={styles.stationsText}>Postos próximos</Text>
            </Pressable>


            <NearStationsModal
                stationsModalVisible={stationsModalVisible}
                setStationsModalVisible={setStationsModalVisible}
                loadingStations={loadingStations}
                nearbyStations={nearbyStations}
                handleFindOnMap={handleFindOnMap}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#e8eef0',
    },
    webview: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'transparent',
    },
    searchBar: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        height: 58,
        backgroundColor: '#fff',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    searchIcon: {
        fontSize: 25,
        color: '#444',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingHorizontal: 12,
        color: '#222',
    },
    searchAction: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        fontSize: 26,
        color: '#333',
    },
    rightControls: {
        position: 'absolute',
        right: 16,
        bottom: 30,
        gap: 12,
    },
    floatingButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    buttonIcon: {
        fontSize: 27,
        color: '#1769e0',
    },
    stationsButton: {
        position: 'absolute',
        left: 16,
        bottom: 32,
        height: 50,
        paddingHorizontal: 18,
        backgroundColor: '#fff',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        elevation: 5,
    },
    stationsIcon: {
        fontSize: 20,
        color: '#1769e0',
    },
    stationsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },
});