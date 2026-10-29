import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import * as Location from 'expo-location';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    const map = L.map('map', {zoomControl: false}).setView(
      [-22.3572, -47.3842],
      14
    );

    window.mapReady = true;

    let userMarker = null;
    let userCircle = null;

    function updateUserLocation(latitude, longitude) {
    const position = [latitude, longitude];

    // Remove o marcador anterior, se existir.
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    if (userCircle) {
        map.removeLayer(userCircle);
    }

    // Círculo azul ao redor da posição do usuário.
    userCircle = L.circle(position, {
        radius: 30,
        color: '#1769e0',
        fillColor: '#1769e0',
        fillOpacity: 0.12,
        weight: 1
    }).addTo(map);

    // Marcador personalizado para o usuário.
    userMarker = L.circleMarker(position, {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#1769e0',
        fillOpacity: 1
    }).addTo(map);

    userMarker.bindPopup('Você está aqui');

    // Centraliza o mapa na posição atual.
    map.setView(position, 16);
    }

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    const postos = [
      {
        nome: 'Posto Centro',
        latitude: -22.3572,
        longitude: -47.3842,
        gasolina: 5.79,
        etanol: 3.89
      },
      {
        nome: 'Posto Avenida',
        latitude: -22.3620,
        longitude: -47.3900,
        gasolina: 5.69,
        etanol: 3.99
      }
    ];
  </script>
</body>
</html>
`;




export default function MapInterface() {
    const webViewRef = useRef<WebView>(null);

    const router = useRouter();
    const [search, setSearch] = useState('');

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [loading, setLoading] = useState(true);

    function createMapHTML(latitude: number, longitude: number) {
        return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const latitude = ${latitude};
          const longitude = ${longitude};

          const map = L.map('map').setView(
            [latitude, longitude],
            16
          );

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; OpenStreetMap contributors'
            }
          ).addTo(map);

          // Marcador da localização do usuário
          L.circleMarker([latitude, longitude], {
            radius: 9,
            color: '#ffffff',
            weight: 3,
            fillColor: '#1769e0',
            fillOpacity: 1
          })
          .addTo(map)
          .bindPopup('Você está aqui');
        </script>
      </body>
    </html>
  `;
    }

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

    // useEffect(() => {
    //     let subscription: Location.LocationSubscription | null = null;
    //     let active = true;

    //     async function startTracking() {
    //         try {
    //             const { status } =
    //                 await Location.requestForegroundPermissionsAsync();

    //             if (status !== 'granted' || !active) {
    //                 return;
    //             }

    //             subscription = await Location.watchPositionAsync(
    //                 {
    //                     accuracy: Location.Accuracy.High,
    //                     distanceInterval: 5,
    //                     timeInterval: 2000,
    //                 },
    //                 (position) => {
    //                     if (!active) return;

    //                     const { latitude, longitude } = position.coords;

    //                     webViewRef.current?.injectJavaScript(`
    //         updateUserLocation(${latitude}, ${longitude});
    //         true;
    //       `);
    //                 }
    //             );
    //         } catch (error) {
    //             console.error('Erro ao acompanhar localização:', error);
    //         }
    //     }

    //     startTracking();

    //     return () => {
    //         active = false;
    //         subscription?.remove();
    //     };
    // }, []);

    const insets = useSafeAreaInsets();

    function handleSearch() {
        if (!search.trim()) return;

        // Depois podemos enviar a pesquisa ao Leaflet
        // ou consultar uma API de endereços.
        Alert.alert('Pesquisar', `Busca por: ${search}`);
    }

    function handleFilters() {
        Alert.alert('Filtros', 'Aqui ficarão os filtros de combustível.');
    }

    function handleStations() {
        Alert.alert('Postos próximos', 'Aqui aparecerá a lista de postos.');
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
            updateUserLocation(${latitude}, ${longitude});
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

    // useEffect(() => {
    //     if (!mapReady || locationLoaded) return;

    //     let cancelled = false;

    //     async function loadUserLocation() {
    //         try {
    //             const { status } =
    //                 await Location.requestForegroundPermissionsAsync();

    //             if (status !== 'granted') {
    //                 Alert.alert(
    //                     'Localização',
    //                     'Permita o acesso à localização para mostrar sua posição no mapa.'
    //                 );
    //                 return;
    //             }

    //             const location = await Location.getCurrentPositionAsync({
    //                 accuracy: Location.Accuracy.High,
    //             });

    //             if (cancelled) return;

    //             const { latitude, longitude } = location.coords;

    //             webViewRef.current?.injectJavaScript(`
    //             updateUserLocation(${latitude}, ${longitude});
    //             true;
    //         `);

    //             setLocationLoaded(true);
    //         } catch (error) {
    //             console.error('Erro ao obter localização:', error);
    //         }
    //     }

    //     loadUserLocation();

    //     return () => {
    //         cancelled = true;
    //     };
    // }, [mapReady, locationLoaded]);


    return (
        <View style={styles.container}>
            {/* Mapa como camada de fundo */}
            {location && (
                <WebView
                    originWhitelist={['*']}
                    source={{
                        html: createMapHTML(
                            location.latitude,
                            location.longitude
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