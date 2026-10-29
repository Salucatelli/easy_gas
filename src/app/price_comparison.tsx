import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const FUEL_TYPES = ['Gasolina', 'Etanol', 'Diesel', 'GNV'];

const MOCK_STATIONS = [
    {
        id: '1',
        name: 'Posto Shell - Av. Dona Renata',
        distance: '0.8 km',
        price: 'R$ 5,49',
        fuel: 'Gasolina',
        badge: 'Menor Preço',
        updatedAt: 'há 10 min',
    },
    {
        id: '2',
        name: 'Posto Ipiranga - Centro',
        distance: '1.2 km',
        price: 'R$ 5,55',
        fuel: 'Gasolina',
        badge: 'Mais Próximo',
        updatedAt: 'há 25 min',
    },
    {
        id: '3',
        name: 'Posto Petrobras - BR-330',
        distance: '2.5 km',
        price: 'R$ 5,59',
        fuel: 'Gasolina',
        badge: null,
        updatedAt: 'há 1 hora',
    },
];

export default function PriceComparisonScreen() {
    const [selectedFuel, setSelectedFuel] = useState('Gasolina');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <LinearGradient colors={['#0066FF', '#003399', '#001A4D']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Comparar Preços</Text>
                    <Text style={styles.headerSubtitle}>Postos perto de você em tempo real</Text>
                </View>

                {/* Campo de Busca */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Buscar posto ou bairro..."
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filtros de Combustível */}
                <View style={styles.fuelFilterContainer}>
                    {FUEL_TYPES.map((fuel) => (
                        <TouchableOpacity
                            key={fuel}
                            style={[
                                styles.fuelChip,
                                selectedFuel === fuel && styles.fuelChipActive,
                            ]}
                            onPress={() => setSelectedFuel(fuel)}
                        >
                            <Text
                                style={[
                                    styles.fuelChipText,
                                    selectedFuel === fuel && styles.fuelChipTextActive,
                                ]}
                            >
                                {fuel}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lista de Postos */}
                <FlatList
                    data={MOCK_STATIONS}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stationName}>{item.name}</Text>
                                    <Text style={styles.stationDistance}>📍 {item.distance} • {item.updatedAt}</Text>
                                </View>
                                {item.badge && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{item.badge}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.cardBody}>
                                <View>
                                    <Text style={styles.fuelLabel}>{item.fuel}</Text>
                                    <Text style={styles.priceText}>{item.price} <Text style={styles.unitText}>/L</Text></Text>
                                </View>

                                <TouchableOpacity style={styles.navButton}>
                                    <Ionicons name="navigate-outline" size={18} color="#000" />
                                    <Text style={styles.navButtonText}>Rota</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, paddingHorizontal: 16 },
    header: { marginTop: 16, marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: '#B0C4DE', marginTop: 4 },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    fuelFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    fuelChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    fuelChipActive: { backgroundColor: '#00E676' },
    fuelChipText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
    fuelChipTextActive: { color: '#003300' },
    listContent: { paddingBottom: 20 },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    stationName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
    stationDistance: { fontSize: 12, color: '#666', marginTop: 4 },
    badge: { backgroundColor: '#00E676', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: 'bold', color: '#004D25' },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    fuelLabel: { fontSize: 12, color: '#666' },
    priceText: { fontSize: 24, fontWeight: 'bold', color: '#0055FF' },
    unitText: { fontSize: 14, fontWeight: 'normal', color: '#666' },
    navButton: {
        flexDirection: 'row',
        backgroundColor: '#00E676',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    navButtonText: { fontWeight: 'bold', color: '#000', marginLeft: 4 },
});