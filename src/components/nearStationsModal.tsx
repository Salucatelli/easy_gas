import React from 'react'; // Não esqueça de importar o React se não estiver usando o novo JSX transform
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
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de importar o Ionicons se usar Expo

// 1. Defina a interface das propriedades (Props) do seu Modal
interface NearStationsModalProps {
    stationsModalVisible: boolean;
    setStationsModalVisible: (valor: boolean) => void;
    loadingStations: boolean; // Adicionado pois estava faltando no seu escopo
    nearbyStations: any[];    // Adicionado (substitua 'any[]' pelo tipo real da sua lista de postos)
    handleFindOnMap: (item: any) => void; // Adicionado pois é disparado no botão
}

// 2. Receba as propriedades desestruturadas dentro do objeto de Props
export default function NearStationsModal({
    stationsModalVisible,
    setStationsModalVisible,
    loadingStations,
    nearbyStations,
    handleFindOnMap
}: NearStationsModalProps) {
    return (
        <Modal
            visible={stationsModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setStationsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>

                    {/* Cabeçalho */}
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>
                                Postos próximos
                            </Text>

                            <Text style={styles.modalSubtitle}>
                                Postos cadastrados no dispositivo
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => setStationsModalVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Ionicons name="close" size={24} color="#FFF" />
                        </Pressable>
                    </View>

                    {/* Conteúdo */}
                    {loadingStations ? (
                        <View style={styles.modalLoading}>
                            <ActivityIndicator size="large" color="#00E676" />
                            <Text style={styles.modalSubtitle}>
                                Procurando postos próximos...
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={nearbyStations}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.stationList}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons
                                        name="location-outline"
                                        size={48}
                                        color="#B0C4DE"
                                    />

                                    <Text style={styles.emptyTitle}>
                                        Nenhum posto encontrado
                                    </Text>

                                    <Text style={styles.emptySubtitle}>
                                        Cadastre postos com latitude e longitude
                                        para encontrá-los aqui.
                                    </Text>
                                </View>
                            }
                            renderItem={({ item, index }) => (
                                <View style={styles.stationCard}>

                                    <View style={styles.stationCardHeader}>
                                        <View style={styles.stationNumber}>
                                            <Text style={styles.stationNumberText}>
                                                {index + 1}
                                            </Text>
                                        </View>

                                        <View style={styles.stationInfo}>
                                            <Text style={styles.stationName}>
                                                {item.name}
                                            </Text>

                                            <Text style={styles.stationAddress}>
                                                {item.address}
                                            </Text>

                                            <Text style={styles.stationDistance}>
                                                <Ionicons
                                                    name="navigate-outline"
                                                    size={13}
                                                    color="#00E676"
                                                />
                                                {' '}
                                                {item.distance < 1
                                                    ? `${Math.round(item.distance * 1000)} m`
                                                    : `${item.distance.toFixed(2)} km`}
                                            </Text>
                                        </View>
                                    </View>

                                    <Pressable
                                        style={styles.findButton}
                                        onPress={() => handleFindOnMap(item)}
                                    >
                                        <Ionicons
                                            name="map-outline"
                                            size={18}
                                            color="#003399"
                                        />

                                        <Text style={styles.findButtonText}>
                                            Encontrar no mapa
                                        </Text>
                                    </Pressable>

                                </View>
                            )}
                        />
                    )}

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },

    modalContainer: {
        backgroundColor: '#003399',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        height: '75%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    modalTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },

    modalSubtitle: {
        color: '#B0C4DE',
        fontSize: 13,
        marginTop: 4,
    },

    modalCloseButton: {
        padding: 8,
    },

    modalLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },

    stationList: {
        paddingBottom: 20,
    },

    stationCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
    },

    stationCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    stationNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00E676',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    stationNumberText: {
        color: '#003399',
        fontWeight: 'bold',
        fontSize: 16,
    },

    stationInfo: {
        flex: 1,
    },

    stationName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    stationAddress: {
        color: '#B0C4DE',
        fontSize: 12,
        marginTop: 4,
    },

    stationDistance: {
        color: '#00E676',
        fontSize: 13,
        marginTop: 6,
    },

    findButton: {
        backgroundColor: '#00E676',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
    },

    findButtonText: {
        color: '#003399',
        fontWeight: 'bold',
        fontSize: 14,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 30,
    },

    emptyTitle: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 12,
    },

    emptySubtitle: {
        color: '#B0C4DE',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
})
