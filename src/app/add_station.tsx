
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddStationScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [gasoline, setGasoline] = useState('');
    const [ethanol, setEthanol] = useState('');
    const [diesel, setDiesel] = useState('');

    function handleSubmit() {
        if (!name.trim() || !address.trim()) {
            Alert.alert(
                'Campos obrigatórios',
                'Informe o nome do posto e o endereço.'
            );
            return;
        }

        const station = {
            name: name.trim(),
            address: address.trim(),
            latitude: latitude.trim(),
            longitude: longitude.trim(),
            prices: {
                gasoline: gasoline.trim(),
                ethanol: ethanol.trim(),
                diesel: diesel.trim(),
            },
        };

        console.log('Novo posto:', station);

        Alert.alert(
            'Posto preenchido!',
            'Os dados foram validados na tela. O salvamento no banco ainda precisa ser implementado.',
            [
                {
                    text: 'OK',
                    onPress: () => router.back(),
                },
            ]
        );
    }

    function renderField(
        label: string,
        icon: React.ComponentProps<typeof Ionicons>['name'],
        value: string,
        onChangeText: (text: string) => void,
        placeholder: string,
        options?: {
            keyboardType?: 'default' | 'numeric' | 'decimal-pad';
            prefix?: string;
        }
    ) {
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>{label}</Text>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name={icon}
                        size={20}
                        color="#00E676"
                    />

                    {options?.prefix && (
                        <Text style={styles.prefix}>
                            {options.prefix}
                        </Text>
                    )}

                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor="#B0C4DE"
                        keyboardType={options?.keyboardType ?? 'default'}
                        autoCapitalize="sentences"
                    />
                </View>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#0066FF', '#003399', '#001A4D']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.keyboard}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                accessibilityLabel="Voltar"
                            >
                                <AntDesign
                                    name="arrow-left"
                                    size={24}
                                    color="#FFF"
                                />
                            </TouchableOpacity>

                            <View style={styles.headerText}>
                                <Text style={styles.title}>
                                    Adicionar posto
                                </Text>
                                <Text style={styles.subtitle}>
                                    Cadastre um posto de combustível
                                </Text>
                            </View>
                        </View>

                        <View style={styles.iconCard}>
                            <View style={styles.stationIcon}>
                                <Ionicons
                                    name="business"
                                    size={32}
                                    color="#0055FF"
                                />
                            </View>
                            <View style={styles.iconCardText}>
                                <Text style={styles.cardTitle}>
                                    Novo estabelecimento
                                </Text>
                                <Text style={styles.cardDescription}>
                                    Preencha as informações do posto e seus preços.
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.sectionHeader}>
                            INFORMAÇÕES DO POSTO
                        </Text>

                        <View style={styles.group}>
                            {renderField(
                                'Nome do posto *',
                                'business-outline',
                                name,
                                setName,
                                'Ex.: Posto Avenida'
                            )}

                            <View style={styles.divider} />

                            {renderField(
                                'Endereço *',
                                'location-outline',
                                address,
                                setAddress,
                                'Rua, número, cidade'
                            )}
                        </View>

                        <Text style={styles.sectionHeader}>
                            LOCALIZAÇÃO NO MAPA
                        </Text>

                        <View style={styles.group}>
                            {renderField(
                                'Latitude',
                                'navigate-outline',
                                latitude,
                                setLatitude,
                                'Ex.: -22.3572',
                                { keyboardType: 'decimal-pad' }
                            )}

                            <View style={styles.divider} />

                            {renderField(
                                'Longitude',
                                'navigate-outline',
                                longitude,
                                setLongitude,
                                'Ex.: -47.3842',
                                { keyboardType: 'decimal-pad' }
                            )}

                            <Text style={styles.helperText}>
                                As coordenadas permitem posicionar o posto no mapa.
                            </Text>
                        </View>

                        <Text style={styles.sectionHeader}>
                            PREÇOS DOS COMBUSTÍVEIS
                        </Text>

                        <View style={styles.group}>
                            {renderField(
                                'Gasolina comum',
                                'water-outline',
                                gasoline,
                                setGasoline,
                                '0,00',
                                {
                                    keyboardType: 'decimal-pad',
                                    prefix: 'R$',
                                }
                            )}

                            <View style={styles.divider} />

                            {renderField(
                                'Etanol',
                                'water-outline',
                                ethanol,
                                setEthanol,
                                '0,00',
                                {
                                    keyboardType: 'decimal-pad',
                                    prefix: 'R$',
                                }
                            )}

                            <View style={styles.divider} />

                            {renderField(
                                'Diesel',
                                'water-outline',
                                diesel,
                                setDiesel,
                                '0,00',
                                {
                                    keyboardType: 'decimal-pad',
                                    prefix: 'R$',
                                }
                            )}
                        </View>

                        <Text style={styles.requiredNote}>
                            * Campos obrigatórios
                        </Text>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={22}
                                color="#003399"
                            />
                            <Text style={styles.submitButtonText}>
                                Cadastrar posto
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
    },
    scroll: {
        padding: 16,
        paddingBottom: 32,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        marginRight: 10,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 13,
        color: '#B0C4DE',
        marginTop: 4,
    },
    iconCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 28,
    },
    stationIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    iconCardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    cardDescription: {
        fontSize: 13,
        color: '#B0C4DE',
        marginTop: 5,
        lineHeight: 18,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#00E676',
        marginBottom: 10,
        marginLeft: 4,
    },
    group: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
        paddingVertical: 4,
    },
    fieldContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    label: {
        fontSize: 13,
        color: '#B0C4DE',
        marginBottom: 10,
    },
    inputContainer: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    prefix: {
        color: '#FFF',
        fontSize: 14,
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginLeft: 16,
    },
    helperText: {
        color: '#B0C4DE',
        fontSize: 12,
        lineHeight: 18,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    requiredNote: {
        fontSize: 12,
        color: '#B0C4DE',
        marginBottom: 16,
        marginLeft: 4,
    },
    submitButton: {
        minHeight: 54,
        borderRadius: 16,
        backgroundColor: '#00E676',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        elevation: 4,
    },
    submitButtonText: {
        color: '#003399',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
