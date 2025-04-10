import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function MermaScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      navigation.navigate('RegistrarMerma', { productoInfo: parsed });
    } catch (e) {
      Alert.alert('Error', 'El QR no tiene un formato válido');
      setScanned(false);
    }
  };

  if (!permission) return <Text>Solicitando permiso...</Text>;
  if (!permission.granted) return <Button title="Permitir cámara" onPress={requestPermission} />;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.frame}></View>
      {scanned && <Button title="Escanear otro" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  frame: {
    position: 'absolute', borderWidth: 2, borderColor: 'lime', width: 250, height: 250,
    top: '50%', left: '50%', marginTop: -125, marginLeft: -125, borderRadius: 12, zIndex: 1,
  }
});
