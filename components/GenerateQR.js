import React from 'react';
import { View, Text, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QRCodeCanvas } from 'qrcode.react';

const GenerateQR = () => {
  // Información del componente
  const componentInfo = JSON.stringify({
    nombre: "Kingston Fury Beast",
    tipo: "DDR4",
    capacidad: "16GB",
    frecuencia: "3200MHz",
    latencia: "CL16"
  });

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Código QR del Componente</Text>
      {Platform.OS === 'web' ? (
        <QRCodeCanvas value={componentInfo} size={200} />
      ) : (
        <QRCode value={componentInfo} size={200} />
      )}
    </View>
  );
};

export default GenerateQR;
