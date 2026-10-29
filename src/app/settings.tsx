import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Switch,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [locationAlerts, setLocationAlerts] = useState(true);
    const router = useRouter();

    return (
        <LinearGradient colors={['#0066FF', '#003399', '#001A4D']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scroll}>
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
                                Configurações
                            </Text>
                            {/* <Text style={styles.subtitle}>
                                Configurações do App
                            </Text> */}
                        </View>
                    </View>


                    {/* Perfil do Usuário */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={28} color="#0055FF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName}>Usuário</Text>
                            <Text style={styles.profileEmail}>usuario@email.com</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="pencil" size={20} color="#00E676" />
                        </TouchableOpacity>
                    </View>

                    {/* Seção Preferências */}
                    <Text style={styles.sectionHeader}>Preferências</Text>
                    <View style={styles.group}>
                        <TouchableOpacity style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="color-palette-outline" size={20} color="#00E676" />
                                <Text style={styles.rowLabel}>Combustível Favorito</Text>
                            </View>
                            <Text style={styles.rowValue}>Gasolina Comum ›</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="location-outline" size={20} color="#00E676" />
                                <Text style={styles.rowLabel}>Raio de Busca</Text>
                            </View>
                            <Text style={styles.rowValue}>10 km ›</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Seção Notificações */}
                    <Text style={styles.sectionHeader}>Notificações</Text>
                    <View style={styles.group}>
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="notifications-outline" size={20} color="#00E676" />
                                <Text style={styles.rowLabel}>Alertas de Preço Baixo</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: '#767577', true: '#00E676' }}
                                thumbColor={notifications ? '#FFF' : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="navigate-outline" size={20} color="#00E676" />
                                <Text style={styles.rowLabel}>Postos Próximos em Rota</Text>
                            </View>
                            <Switch
                                value={locationAlerts}
                                onValueChange={setLocationAlerts}
                                trackColor={{ false: '#767577', true: '#00E676' }}
                                thumbColor={locationAlerts ? '#FFF' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    {/* Sobre e Suporte */}
                    <Text style={styles.sectionHeader}>Sobre</Text>
                    <View style={styles.group}>
                        <TouchableOpacity style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Ionicons name="information-circle-outline" size={20} color="#00E676" />
                                <Text style={styles.rowLabel}>Versão do Aplicativo</Text>
                            </View>
                            <Text style={styles.rowValue}>v1.0.0</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({


    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 6,                 // Aumenta a área de toque para o usuário acertar fácil
        marginRight: 12,            // Cria um espaço entre o ícone e o texto "Configurações"
    },
    headerText: {
        flex: 1,
    },
    subtitle: {
        fontSize: 13,
        color: '#B0C4DE',
        marginTop: 4,
    },

    container: { flex: 1 },
    safeArea: { flex: 1 },
    scroll: { padding: 16 },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },
    profileCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profileName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    profileEmail: { fontSize: 13, color: '#B0C4DE', marginTop: 2 },
    sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#00E676', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
    group: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowLabel: { fontSize: 15, color: '#FFF', marginLeft: 12 },
    rowValue: { fontSize: 14, color: '#B0C4DE' },
    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginLeft: 48 },
});