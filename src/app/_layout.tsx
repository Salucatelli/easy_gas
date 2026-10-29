import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        // Força a remoção da tela branca após o app renderizar
        SplashScreen.hideAsync();
    }, []);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}
