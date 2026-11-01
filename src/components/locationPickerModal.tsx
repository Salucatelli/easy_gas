import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

interface LocationPickerModalProps {
    visible: boolean;
    initialLatitude?: number | null;
    initialLongitude?: number | null;
    onConfirm: (latitude: number, longitude: number) => void;
    onClose: () => void;
}

export default function LocationPickerModal({
    visible,
    initialLatitude,
    initialLongitude,
    onConfirm,
    onClose,
}: LocationPickerModalProps) {
    const [coordinates, setCoordinates] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;

        let cancelled = false;

        async function initializeMap() {
            setLoading(true);
            setHtml(null);

            try {
                let latitude = initialLatitude;
                let longitude = initialLongitude;

                // Se já existem coordenadas cadastradas, utiliza elas.
                // Caso contrário, utiliza a localização atual.
                if (latitude == null || longitude == null) {
                    const { status } =
                        await Location.requestForegroundPermissionsAsync();

                    if (status !== 'granted') {
                        Alert.alert(
                            'Permissão necessária',
                            'Permita o acesso à localização para posicionar o posto.'
                        );
                        onClose();
                        return;
                    }

                    const position = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });

                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                }

                if (cancelled) return;

                setCoordinates({ latitude, longitude });

                setHtml(createMapHTML(latitude, longitude));
            } catch (error) {
                console.error('Erro ao inicializar mapa:', error);

                Alert.alert(
                    'Erro',
                    'Não foi possível obter sua localização.'
                );

                onClose();
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initializeMap();

        return () => {
            cancelled = true;
        };
    }, [visible, initialLatitude, initialLongitude]);

    function handleMessage(event: any) {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (
                data.type === 'location' &&
                typeof data.latitude === 'number' &&
                typeof data.longitude === 'number'
            ) {
                setCoordinates({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            }
        } catch (error) {
            console.error('Erro ao receber coordenadas:', error);
        }
    }

    function handleConfirm() {
        if (!coordinates) {
            Alert.alert(
                'Localização não selecionada',
                'Aguarde o carregamento do mapa.'
            );
            return;
        }

        onConfirm(
            coordinates.latitude,
            coordinates.longitude
        );
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>

                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Pressable onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Text style={styles.title}>
                            Localização do posto
                        </Text>

                        <Text style={styles.subtitle}>
                            Arraste o marcador até a posição desejada
                        </Text>
                    </View>
                </View>

                {/* Mapa */}
                <View style={styles.mapContainer}>
                    {loading || !html ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#00E676" />

                            <Text style={styles.loadingText}>
                                Carregando mapa...
                            </Text>
                        </View>
                    ) : (
                        <WebView
                            originWhitelist={['*']}
                            source={{ html }}
                            javaScriptEnabled
                            domStorageEnabled
                            onMessage={handleMessage}
                            style={styles.webview}
                        />
                    )}
                </View>

                {/* Coordenadas */}
                <View style={styles.coordinatesContainer}>
                    <Text style={styles.coordinatesTitle}>
                        POSIÇÃO SELECIONADA
                    </Text>

                    <Text style={styles.coordinatesText}>
                        Latitude: {coordinates?.latitude.toFixed(6) ?? '--'}
                    </Text>

                    <Text style={styles.coordinatesText}>
                        Longitude: {coordinates?.longitude.toFixed(6) ?? '--'}
                    </Text>
                </View>

                {/* Botão de confirmação */}
                <View style={styles.footer}>
                    <Pressable
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                        disabled={!coordinates || loading}
                    >
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={22}
                            color="#003399"
                        />

                        <Text style={styles.confirmButtonText}>
                            Confirmar localização
                        </Text>
                    </Pressable>
                </View>

            </View>
        </Modal>
    );
}

// HTML do Leaflet
function createMapHTML(
    latitude: number,
    longitude: number
) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

        <script>
          const map = L.map('map').setView(
            [${latitude}, ${longitude}],
            17
          );

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            }
          ).addTo(map);

          // Marcador que o usuário poderá arrastar
          const marker = L.marker(
            [${latitude}, ${longitude}],
            {
              draggable: true,
              autoPan: true
            }
          ).addTo(map);

          marker.bindPopup('Posição do posto').openPopup();

          function sendCoordinates() {
            const position = marker.getLatLng();

            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'location',
                latitude: position.lat,
                longitude: position.lng
              })
            );
          }

          // Envia as coordenadas iniciais
          sendCoordinates();

          // Envia novas coordenadas após arrastar
          marker.on('dragend', sendCoordinates);
        </script>
      </body>
    </html>
  `;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001A4D',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 18,
        backgroundColor: '#003399',
    },

    backButton: {
        padding: 8,
        marginRight: 10,
    },

    headerText: {
        flex: 1,
    },

    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#B0C4DE',
        fontSize: 12,
        marginTop: 4,
    },

    mapContainer: {
        flex: 1,
        overflow: 'hidden',
    },

    webview: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },

    loadingText: {
        color: '#FFF',
        fontSize: 14,
    },

    coordinatesContainer: {
        padding: 16,
        backgroundColor: '#003399',
    },

    coordinatesTitle: {
        color: '#00E676',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    coordinatesText: {
        color: '#FFF',
        fontSize: 13,
        marginTop: 3,
    },

    footer: {
        padding: 16,
        backgroundColor: '#003399',
    },

    confirmButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: '#00E676',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    confirmButtonText: {
        color: '#003399',
        fontSize: 15,
        fontWeight: 'bold',
    },
});