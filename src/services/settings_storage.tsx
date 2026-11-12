
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
    userName: string;
    favoriteFuel: string;
    searchRadius: number;
    notifications: boolean;
    locationAlerts: boolean;
}

const SETTINGS_KEY = '@easy_gas:settings';

export const defaultSettings: UserSettings = {
    userName: '',
    favoriteFuel: 'Gasolina Comum',
    searchRadius: 10,
    notifications: true,
    locationAlerts: true,
};

// Recupera as configurações salvas
export async function getSettings(): Promise<UserSettings> {
    try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);

        if (storedSettings) {
            return {
                ...defaultSettings,
                ...JSON.parse(storedSettings),
            };
        }

        return defaultSettings;
    } catch (error) {
        console.error('Erro ao recuperar configurações:', error);
        return defaultSettings;
    }
}

// Salva todas as configurações
export async function saveSettings(settings: UserSettings): Promise<void> {
    try {
        await AsyncStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        throw error;
    }
}

// Atualiza apenas uma configuração
export async function updateSettings(
    changes: Partial<UserSettings>
): Promise<UserSettings> {
    const currentSettings = await getSettings();

    const updatedSettings = {
        ...currentSettings,
        ...changes,
    };

    await saveSettings(updatedSettings);

    return updatedSettings;
}
