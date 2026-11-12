
import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Option {
    label: string;
    value: string | number;
}

interface SettingsOptionModalProps {
    visible: boolean;
    title: string;
    options: Option[];
    selectedValue: string | number;
    onClose: () => void;
    onSave: (value: string | number) => void;
}

export default function SettingsOptionModal({
    visible,
    title,
    options,
    selectedValue,
    onClose,
    onSave,
}: SettingsOptionModalProps) {

    const [selected, setSelected] = useState<string | number>(
        selectedValue
    );

    useEffect(() => {
        if (visible) {
            setSelected(selectedValue);
        }
    }, [visible, selectedValue]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#0066FF', '#335599']}
                        style={styles.header}
                    >
                        <Text style={styles.title}>{title}</Text>

                        <TouchableOpacity onPress={onClose}>
                            <Ionicons
                                name="close"
                                size={25}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.optionsContainer}>
                        {options.map((option) => {
                            const isSelected =
                                selected === option.value;

                            return (
                                <TouchableOpacity
                                    key={String(option.value)}
                                    style={styles.option}
                                    onPress={() =>
                                        setSelected(option.value)
                                    }
                                >
                                    <Text style={styles.optionText}>
                                        {option.label}
                                    </Text>

                                    <Ionicons
                                        name={
                                            isSelected
                                                ? 'radio-button-on'
                                                : 'radio-button-off'
                                        }
                                        size={22}
                                        color={
                                            isSelected
                                                ? '#0066FF'
                                                : '#999999'
                                        }
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => onSave(selected)}
                        >
                            <Text style={styles.saveText}>
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        overflow: 'hidden',
    },
    header: {
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 18,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: '#666666',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#0066FF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
