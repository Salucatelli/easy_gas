
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import MapInterface from '../components/map_interface';
import UserNameModal from '../components/userNameComponent';

import {
    getSettings,
    updateSettings,
} from '../services/settings_storage';

export default function HomeScreen() {
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {
        async function checkUserSettings() {
            try {
                const settings = await getSettings();

                if (!settings.userName.trim()) {
                    setNameModalVisible(true);
                }
            } catch (error) {
                console.error('Erro ao verificar usuário:', error);
            } finally {
                setLoadingSettings(false);
            }
        }

        checkUserSettings();
    }, []);

    async function handleSaveName(name: string) {
        try {
            await updateSettings({
                userName: name,
            });

            setNameModalVisible(false);
        } catch (error) {
            console.error('Erro ao salvar nome:', error);
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={styles.container}
                edges={['bottom', 'left', 'right']}
            >
                <StatusBar barStyle="dark-content" />

                <View style={styles.mapContainer}>
                    <MapInterface />
                </View>

                <UserNameModal
                    visible={!loadingSettings && nameModalVisible}
                    onSave={handleSaveName}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
    },
});
