// types.ts
import type { StackScreenProps } from '@react-navigation/stack';

// 1. Defina quais telas existem e o que elas recebem de parâmetro
// Use 'undefined' se a tela não precisar receber nenhum dado
export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    // Exemplo se uma tela precisasse de um ID: Profile: { userId: string };
};

// 2. Crie um tipo utilitário para as propriedades das telas (Props)
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;
