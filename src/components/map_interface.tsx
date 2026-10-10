
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    const map = L.map('map', {zoomControl: false}).setView(
      [-22.3572, -47.3842],
      14
    );

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    const postos = [
      {
        nome: 'Posto Centro',
        latitude: -22.3572,
        longitude: -47.3842,
        gasolina: 5.79,
        etanol: 3.89
      },
      {
        nome: 'Posto Avenida',
        latitude: -22.3620,
        longitude: -47.3900,
        gasolina: 5.69,
        etanol: 3.99
      }
    ];
  </script>
</body>
</html>
`;

export default function MapInterface() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});


// Código para adicionar os postos no mapa
// postos.forEach((posto) => {
//       const marker = L.circleMarker(
//         [posto.latitude, posto.longitude],
//         {
//           radius: 9,
//           color: '#ffffff',
//           weight: 2,
//           fillColor: '#16a34a',
//           fillOpacity: 1
//         }
//       ).addTo(map);

//       marker.bindPopup(
//         '<strong>' + posto.nome + '</strong><br>' +
//         'Gasolina: R$ ' + posto.gasolina.toFixed(2) + '<br>' +
//         'Etanol: R$ ' + posto.etanol.toFixed(2)
//       );
//     });
