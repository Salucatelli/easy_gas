import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';

import { getStations, Station } from '../services/stationStorage';
import NearStationsModal from "./nearStationsModal";
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

export default function MapInterface() {
    const [stationsModalVisible, setStationsModalVisible] = useState(false);
    const [nearbyStations, setNearbyStations] = useState<
        (Station & { distance: number })[]
    >([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    const [stations, setStations] = useState<Station[]>([]);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const router = useRouter();
    const [search, setSearch] = useState('');

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [loading, setLoading] = useState(true);

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
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted' || !active) return;

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5,
                        timeInterval: 2000,
                    },
                    (position) => {
                        if (!active) return;

                        const { latitude, longitude } = position.coords;

                        if (iframeRef.current?.contentWindow) {
                            const iframeWindow = iframeRef.current.contentWindow as any;
                            if (typeof iframeWindow.updateUserLocation === 'function') {
                                iframeWindow.updateUserLocation(latitude, longitude);
                            }
                        }
                    }
                );
            } catch (error) {
                console.error('Erro ao acompanhar localização:', error);
            }
        }

        startTracking();

        async function getUserLocation() {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') return;

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
        setStationsModalVisible(false);
    }

    function handleSearch() {
        if (!search.trim()) return;
        Alert.alert('Pesquisar', `Busca por: ${search}`);
    }

    function handleFilters() {
        Alert.alert('Filtros', 'Aqui ficarão os filtros de combustível.');
    }

    async function handleStations() {
        try {
            setStationsModalVisible(true);
            setLoadingStations(true);

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Localização necessária',
                    'Permita o acesso à localização para encontrar os postos próximos.'
                );
                setStationsModalVisible(false);
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = position.coords;
            const savedStations = await getStations();

            const sortedStations = savedStations
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
            Alert.alert('Erro', 'Não foi possível carregar os postos próximos.');
            setStationsModalVisible(false);
        } finally {
            setLoadingStations(false);
        }
    }

    async function handleLocation() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão necessária',
                    'Permita o acesso à localização para encontrar sua posição no mapa.'
                );
                return;
            }

            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = pos.coords;

            if (iframeRef.current?.contentWindow) {
                const iframeWindow = iframeRef.current.contentWindow as any;
                if (iframeWindow.mapReady && typeof iframeWindow.updateUserLocation === 'function') {
                    iframeWindow.updateUserLocation(latitude, longitude);
                }
            }
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
            {/* Wrapper isolado para o Iframe */}
            {location && (
                <View style={styles.mapContainer}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={createMapHTML(
                            location.latitude,
                            location.longitude,
                            stations
                        )}
                        style={{
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'auto',
                        }}
                    />
                </View>
            )}

            {/* Barra de pesquisa */}
            <View style={[styles.searchBar, { top: insets.top || 16 }]}>
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
                    <Ionicons name="add" size={32} color="#1769e0" />
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
    mapContainer: {
        ...StyleSheet.absoluteFill,
        zIndex: 0,
    },
    searchBar: {
        position: 'absolute',
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
        zIndex: 10,
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
        zIndex: 10,
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
        zIndex: 10,
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