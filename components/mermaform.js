import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config';
import { getFechaTijuana} from './apis/horarios';

export default function RegistrarMerma({ route, navigation }) {
  const { productoInfo } = route.params;
  const [motivo, setMotivo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [idUsuario, setIdUsuario] = useState(null);
  const [lineasDistribucion, setLineasDistribucion] = useState([]);
  const [distribucionId, setDistribucionId] = useState(null);
  const [fechaHora, setFechaHora] = useState('');

  


  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setIdUsuario(userId);

      getFechaTijuana(setFechaHora); // esto guarda la fecha/hora en tu estado

      fetchUserId();
    };

    const fetchLineasDistribucion = async () => {
      try {
        const response = await fetch(baseURL + 'distribucion-linea');
        const data = await response.json();
        setLineasDistribucion(data);
      } catch (error) {
        console.error('Error al obtener líneas de distribución:', error);
      }
    };

    fetchUserId();
    fetchLineasDistribucion();
  }, []);

  const handleSubmit = async () => {
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) return Alert.alert('Cantidad inválida');
    if (!motivo) return Alert.alert('Motivo requerido');
    if (!distribucionId) return Alert.alert('Selecciona una línea de distribución');
    if (!idUsuario) return Alert.alert('ID de usuario no disponible');
 
     console.log('fecha',fechaHora)
    const body = {
      cantidad: parseInt(cantidad),
      componente_id: parseInt(productoInfo.id),
      distribucion_id: parseInt(distribucionId),
      id_usuario_id: parseInt(idUsuario),
      motivo,
      fecha_merma: fechaHora,
    };

    try {
      const response = await fetch(baseURL+'mermas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (response.ok) {
        Alert.alert('✅ Éxito', 'Merma registrada correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', json.error || 'No se pudo registrar la merma');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Fallo de conexión con el servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📦 Información del Producto</Text>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{productoInfo.nombre}</Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.value}>{productoInfo.descripcion}</Text>

        <Text style={styles.label}>ID componente</Text>
        <Text style={styles.value}>{productoInfo.id}</Text>

        <TextInput
          style={styles.input}
          placeholder="Motivo de merma"
          value={motivo}
          onChangeText={setMotivo}
        />

        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={cantidad}
          keyboardType="numeric"
          onChangeText={setCantidad}
        />

        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={setDistribucionId}
            items={lineasDistribucion.map((linea) => ({
              label: `${linea.linea.nombre} - ${linea.orden.codigo_orden}`,
              value: linea.id_distribucion,
            }))}
            placeholder={{ label: 'Seleccionar línea de distribución...', value: null }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar Merma</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  input: {
    backgroundColor: '#fdfdfd',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
