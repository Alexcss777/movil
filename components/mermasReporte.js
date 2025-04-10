import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import HeaderCustom from './menu/header';

export default function ReporteMermas() {
  const [mermas, setMermas] = useState([]);
  const [distribuciones, setDistribuciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mermasRes, distribRes] = await Promise.all([
          fetch('http://192.168.241.32:8000/api/mermas/'),
          fetch('http://192.168.241.32:8000/api/distribucion-linea/')
        ]);
        const mermasData = await mermasRes.json();
        const distribData = await distribRes.json();
        setMermas(mermasData);
        setDistribuciones(distribData);
      } catch (err) {
        console.error('❌ Error al cargar datos:', err);
        Alert.alert('Error', 'No se pudieron obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const buscarLinea = (distribucionId) => {
    const dist = distribuciones.find(d => d.id === distribucionId || d.id_distribucion === distribucionId);
    return dist?.linea?.nombre || '—';
  };

  const generarPDF = async () => {
    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 30px; background: #f4f6f9; }
            h2 { text-align: center; color: #1a237e; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
            th, td { border: 1px solid #ddd; padding: 10px 14px; font-size: 14px; }
            th { background-color: #e3eaf6; color: #1a237e; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>Reporte de Mermas</h2>
          <table>
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Cantidad</th>
                <th>Línea</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              ${mermas.map(m => `
                <tr>
                  <td>${m.motivo || '—'}</td>
                  <td>${m.cantidad}</td>
                  <td>${buscarLinea(m.distribucion_id)}</td>
                  <td>${m.id_usuario?.nombre || '—'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const response = await fetch('https://api.html2pdf.app/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          apiKey: 'Ur4OnOxd7dtZ4ZX2ghpX5nONOTQahd33y2Au7J4NnETxtLP1IWfmtLriKSfcIylH'
        }),
      });

      if (!response.ok) throw new Error('Fallo la generación del PDF');

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const fileUri = FileSystem.documentDirectory + 'reporte-mermas.pdf';

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir PDF',
        });
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
      <HeaderCustom title="Inicio" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reporte de Mermas</Text>
  
        {loading ? (
          <ActivityIndicator size="large" color="#1a237e" />
        ) : (
          <>
            {mermas.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.item}><Text style={styles.label}>Motivo:</Text> {item.motivo}</Text>
                <Text style={styles.item}><Text style={styles.label}>Cantidad:</Text> {item.cantidad}</Text>
                <Text style={styles.item}><Text style={styles.label}>Línea:</Text> {buscarLinea(item.distribucion_id)}</Text>
                <Text style={styles.item}><Text style={styles.label}>Usuario:</Text> {item.id_usuario?.nombre || '—'}</Text>
              </View>
            ))}
  
            <TouchableOpacity style={styles.button} onPress={generarPDF}>
              <Text style={styles.buttonText}>Generar PDF</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
   
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f4f6f8', // Fondo moderno
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#0d47a1', // Azul profesional
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1565c0',
  },
  label: {
    fontWeight: 'bold',
    color: '#212121',
  },
  text: {
    fontSize: 15,
    color: '#424242',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#1565c0',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

