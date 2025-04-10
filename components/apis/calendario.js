import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarioFeriados() {
  const [feriados, setFeriados] = useState({});
  const [feriadosInfo, setFeriadosInfo] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFeriados = async () => {
      try {
        const res = await fetch('https://date.nager.at/api/v3/PublicHolidays/2025/MX');
        const data = await res.json();

        const marcados = {};
        data.forEach((dia) => {
          marcados[dia.date] = {
            marked: true,
            dotColor: 'red',
            selected: true,
            selectedColor: '#ffe6e6',
          };
        });

        setFeriados(marcados);
        setFeriadosInfo(data);
      } catch (error) {
        console.error('Error al cargar feriados:', error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarFeriados();
  }, []);

  const mostrarNombreFeriado = (date) => {
    const feriado = feriadosInfo.find((f) => f.date === date);
    if (feriado) {
      Alert.alert('📌 Feriado', `${feriado.localName} (${feriado.date})`);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#66d8ee" />
        <Text>Cargando calendario de feriados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado azul */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Días Feriados - México 2025</Text>
      </View>

      {/* Contenedor del calendario con sombra y borde */}
      <View style={styles.calendarCard}>
        <Calendar
          markedDates={feriados}
          onDayPress={(day) => mostrarNombreFeriado(day.dateString)}
          theme={{
            selectedDayBackgroundColor: '#ffe6e6',
            selectedDayTextColor: '#d32f2f',
            todayTextColor: '#00adf5',
            arrowColor: '#a734ed',
            dotColor: 'red',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    paddingTop: 30,
  },
  header: {
    backgroundColor: '#66d8ee',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
