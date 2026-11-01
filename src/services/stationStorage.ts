import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Station {
    id: string;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    prices: {
        gasoline: string;
        ethanol: string;
        diesel: string;
    };
    createdAt: string;
}

const STORAGE_KEY = '@easy_gas:stations';

export async function getStations(): Promise<Station[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data) as Station[];
    } catch (error) {
        console.error('Erro ao buscar postos:', error);
        return [];
    }
}

export async function saveStation(station: Station): Promise<void> {
    const stations = await getStations();

    stations.push(station);

    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stations)
    );
}

export async function deleteStation(id: string): Promise<void> {
    const stations = await getStations();

    const updatedStations = stations.filter(
        station => station.id !== id
    );

    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStations)
    );
}