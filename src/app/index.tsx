
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapInterface from '../components/map_interface';

export default function HomeScreen() {
  return (
    <SafeAreaProvider >
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <StatusBar barStyle="dark-content"></StatusBar>
            {/* <Text style={styles.title}>
                Combustível App
            </Text> */}

            <View style={styles.mapContainer}>
                <MapInterface />
            </View>


        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  mapContainer: {
    flex: 1,
  },
});


// import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import MapInterface from '../components/map_interface';

// export default function HomeScreen() {
//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
//         <View style={styles.mapContainer}>
//           {/* Mapa ao fundo */}
//           <MapInterface />

//           {/* Barra de pesquisa */}
//           <View style={styles.searchBar}>
//             <Text style={styles.searchIcon}>⌕</Text>
//             <TextInput
//               placeholder="Buscar posto ou endereço"
//               placeholderTextColor="#888"
//               style={styles.searchInput}
//             />
//             <Text style={styles.searchIcon}>☷</Text>
//           </View>

//           {/* Filtros de combustível */}
//           <View style={styles.filters}>
//             {['Todos', 'Gasolina', 'Etanol', 'Diesel'].map((item) => (
//               <Pressable key={item} style={styles.filter}>
//                 <Text style={styles.filterText}>{item}</Text>
//               </Pressable>
//             ))}
//           </View>

//           {/* Botão de localização */}
//           <Pressable style={styles.locationButton}>
//             <Text style={styles.locationIcon}>◎</Text>
//           </Pressable>

//           {/* Painel inferior inicial */}
//           <View style={styles.bottomPanel}>
//             <View style={styles.panelHandle} />
//             <Text style={styles.panelTitle}>Postos próximos</Text>
//             <Text style={styles.panelDescription}>
//               Selecione um posto no mapa para consultar os preços.
//             </Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   mapContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   searchBar: {
//     position: 'absolute',
//     top: 12,
//     left: 16,
//     right: 16,
//     height: 56,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     elevation: 5,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     marginHorizontal: 10,
//     color: '#222',
//   },
//   searchIcon: {
//     fontSize: 24,
//     color: '#333',
//   },
//   filters: {
//     position: 'absolute',
//     top: 82,
//     left: 16,
//     right: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 6,
//   },
//   filter: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     elevation: 3,
//   },
//   filterText: {
//     color: '#222',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   locationButton: {
//     position: 'absolute',
//     right: 18,
//     bottom: 200,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   locationIcon: {
//     fontSize: 28,
//     color: '#1769e0',
//   },
//   bottomPanel: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     paddingBottom: 28,
//     elevation: 10,
//   },
//   panelHandle: {
//     alignSelf: 'center',
//     width: 42,
//     height: 5,
//     borderRadius: 3,
//     backgroundColor: '#ddd',
//     marginBottom: 18,
//   },
//   panelTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   panelDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 8,
//   },
// });
