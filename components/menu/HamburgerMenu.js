import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Pressable, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const goTo = (route) => {
    setVisible(false);
    navigation.navigate(route);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.menuIcon}>
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => goTo('Home')}>
              <Text style={styles.link}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('escaner')}>
              <Text style={styles.link}>Escanear QR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('mermaScanner')}>
              <Text style={styles.link}>Escanear Merma</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('RegistrarMerma')}>
              <Text style={styles.link}>Registrar Merma</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('Reportes')}>
              <Text style={styles.link}>Reporte PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('dashboardMermas')}>
              <Text style={styles.link}>Gráficos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('calendarioFeriados')}>
              <Text style={styles.link}>Feriados</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('Login')}>
              <Text style={[styles.link, { color: '#d32f2f' }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
  },
  menuIcon: {
    width: 30,
    height: 24,
    justifyContent: 'space-between',
  },
  bar: {
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menu: {
    width: width * 0.8,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    height: '100%',
    elevation: 8,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  link: {
    fontSize: 17,
    paddingVertical: 14,
    color: '#0d47a1',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
