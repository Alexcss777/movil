import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ComponentInfo = ({ route }) => {
  const { qrData } = route.params;

  let parsedData;
  try {
    parsedData = JSON.parse(qrData); // Intenta parsear el JSON
  } catch (error) {
    parsedData = null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Información del Componente</Text>
        <Text style={styles.label}>Contenido escaneado:</Text>

        {parsedData ? (
          Object.entries(parsedData).map(([key, value]) => (
            <View key={key} style={styles.itemRow}>
              <Text style={styles.key}>{key}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>{qrData}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ComponentInfo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0d47a1',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  key: {
    fontWeight: 'bold',
    color: '#1976d2',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
    textAlign: 'right',
  },
});
