import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRScanner({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Todavía cargando
    return <Text>Solicitando permiso de cámara...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permiso de cámara denegado</Text>
        <Button title="Solicitar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    navigation.navigate('ComponentInfo', { qrData: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.frame}></View>
      {scannedData && (
        <Button title="Escanear otro" onPress={() => setScannedData(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  frame: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'limegreen',
    width: 200,
    height: 200,
    top: '40%',
    left: '25%',
    borderRadius: 12,
    zIndex: 1,
  },
});
