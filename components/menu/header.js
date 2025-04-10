import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HeaderCustom({ title = "Título" }) {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const goTo = (route) => {
    setVisible(false);
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("usuario");
    setVisible(false);
    navigation.replace("Login");
  };

  return (
    <View style={styles.header}>
      {/* Menú hamburguesa */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuIcon}>
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Logo / botón lateral derecho */}
      <TouchableOpacity onPress={handleLogout}>
      </TouchableOpacity>

      {/* Modal menú lateral */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Opciones</Text>
            <TouchableOpacity onPress={() => goTo('Home')}><Text style={styles.link}>Inicio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('escaner')}><Text style={styles.link}>Escanear QR</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('mermaScanner')}><Text style={styles.link}>Escanear Merma</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('RegistrarMerma')}><Text style={styles.link}>Registrar Merma</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('Reportes')}><Text style={styles.link}>Reporte PDF</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('dashboardMermas')}><Text style={styles.link}>Gráficos</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('calendarioFeriados')}><Text style={styles.link}>Feriados</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}><Text style={styles.link}>Cerrar Sesión</Text></TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0d47a1',
        height: 90, // Más alto para dar espacio
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        width: '100%', 
        paddingTop: 35, // Este es el espacio desde arriba
        elevation: 5,
      },      
  menuIcon: {
    width: 30,
    justifyContent: 'space-between',
    height: 20,
  },
  bar: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    color: '#0d47a1',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
