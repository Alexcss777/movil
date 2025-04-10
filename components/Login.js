import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './config';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = async () => {
    console.log('la url es ',baseURL + 'login/');
    try {
      const response = await fetch(baseURL + 'login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.usuario.id_usuario;
        console.log(data.usuario) // Extraemos el id_usuario
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario)); // Guardamos el id_usuario como string
        console.log('ID de usuario guardado:', userId); // Verifica que se guarda correctamente
        navigation.replace('Home');

      } else {
        Alert.alert('Error', data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error(' Error de conexión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>


      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="Ingrese su correo"
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder=""
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Todos los derechos reservados</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d47a1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    marginTop: 30,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#FBC02D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#37474F',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 25,
    fontSize: 12,
    color: '#ffffff',
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  
  logo: {
    width: 100,
    height: 100,
  },
});
