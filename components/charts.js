import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import baseURL from './config';
import HeaderCustom from './menu/header';
export default function DashboardMermas() {
  const [mermas, setMermas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMermas = async () => {
      try {
        const response = await fetch(baseURL +'mermas/');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setMermas(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener los datos de mermas.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMermas();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FFFF" />
      </View>
    );
  }

  if (mermas.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No hay datos de mermas disponibles.</Text>
      </View>
    );
  }

  const mermasPorMotivo = {};
  mermas.forEach(item => {
    const motivo = item.motivo?.trim() || 'No especificado';
    mermasPorMotivo[motivo] = (mermasPorMotivo[motivo] || 0) + item.cantidad;
  });

  const motivoLabels = Object.keys(mermasPorMotivo);
  const motivoData = Object.values(mermasPorMotivo);

  const doughnutChart = {
    type: 'doughnut',
    data: {
      labels: motivoLabels,
      datasets: [
        {
          data: motivoData,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00C49F'
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Mermas por Motivo',
          color: '#ffffff',
          font: { size: 18 },
        },
        legend: {
          labels: {
            color: '#ffffff',
            font: { size: 14 },
          },
        },
      },
    },
  };

  const mermasPorFecha = {};
  mermas.forEach(item => {
    const fecha = new Date(item.fecha_merma).toLocaleDateString();
    mermasPorFecha[fecha] = (mermasPorFecha[fecha] || 0) + item.cantidad;
  });

  const fechaLabels = Object.keys(mermasPorFecha);
  const fechaData = Object.values(mermasPorFecha);

  const barChart = {
    type: 'bar',
    data: {
      labels: fechaLabels,
      datasets: [
        {
          label: 'Cantidad de Mermas',
          data: fechaData.map(value => Math.round(value)),
          backgroundColor: '#36A2EB',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Cantidad de Mermas por Fecha',
          color: '#ffffff',
          font: { size: 18 },
        },
        legend: {
          labels: {
            color: '#ffffff',
            font: { size: 14 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#ffffff',
            stepSize: 1,
            precision: 0,
            callback: function(value) {
              return Number.isInteger(value) ? value : null;
            },
          },
        },
      },
    },
  };

  const chartDoughnutUrl = `https://quickchart.io/chart?backgroundColor=%232d2c55&c=${encodeURIComponent(
    JSON.stringify(doughnutChart)
  )}`;

  const chartBarUrl = `https://quickchart.io/chart?backgroundColor=%232d2c55&c=${encodeURIComponent(
    JSON.stringify(barChart)
  )}`;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <HeaderCustom title="Inicio" />
      <Text style={styles.title}></Text>

      <View style={styles.card}>
        <Image source={{ uri: chartDoughnutUrl }} style={styles.chart} resizeMode="contain" />
      </View>

      <View style={styles.card}>
        <Image source={{ uri: chartBarUrl }} style={styles.chart} resizeMode="contain" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#252440',
  },
  center: {
    paddingTop: 80,
    paddingHorizontal: 16,
    backgroundColor: '#252440',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#3b3b66',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    elevation: 4,
  },
  chart: {
    width: '100%',
    height: 280,
    borderRadius: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
