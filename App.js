import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './components/Login';
import QRScanner from './components/QRScanner';
import ComponentInfo from './components/ComponentInfo';
import HomeScreen from './components/HomeScreen';
import MermaScanner from './components/MermaScanner';
import DashboardMermasPanel from './components/charts';
import RegistrarMerma from './components/mermaform';
import CalendarioFeriados from './components/apis/calendario';
import ReporteMermas from './components/mermasReporte'; // ajustá la ruta si es necesario


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="escaner" component={QRScanner} />
        <Stack.Screen name="ComponentInfo" component={ComponentInfo} />
        <Stack.Screen name="mermaScanner" component={MermaScanner} />
        <Stack.Screen name="dashboardMermas" component={DashboardMermasPanel} />
        <Stack.Screen name="RegistrarMerma" component={RegistrarMerma} />
        <Stack.Screen name="Reportes" component={ReporteMermas} />
        <Stack.Screen name="calendarioFeriados" component={CalendarioFeriados} options={{ title: 'Calendario Feriados' }}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
