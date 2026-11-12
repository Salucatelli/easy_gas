
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UserNameModalProps {
    visible: boolean;
    onSave: (name: string) => void;
}

export default function UserNameModal({
    visible,
    onSave,
}: UserNameModalProps) {
    const [name, setName] = useState('');

    function handleSave() {
        const trimmedName = name.trim();

        if (!trimmedName) {
            return;
        }

        onSave(trimmedName);
        setName('');
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <LinearGradient
                        colors={['#0066FF', '#003399', '#001A4D']}
                        style={styles.card}
                    >
                        <Text style={styles.title}>Bem-vindo!</Text>

                        <Text style={styles.description}>
                            Antes de começar, como podemos chamar você?
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            placeholderTextColor="#8899AA"
                            value={name}
                            onChangeText={setName}
                            maxLength={40}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[
                                styles.button,
                                !name.trim() && styles.buttonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.buttonText}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 20,
        overflow: 'hidden',
    },
    card: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    description: {
        color: '#B0C4DE',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: '#003399',
        marginBottom: 18,
    },
    button: {
        width: '100%',
        backgroundColor: '#00E676',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#003399',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
