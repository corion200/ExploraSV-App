import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './App';
import SignUp from './signUp';
import Index from './indexScreen';
import Login from './login';
import Site from './site';
import ChatScreen from './components/chatbot/ChatScreen';
import Perfil from './perfil';
import { ClerkProvider } from '@clerk/clerk-expo';
import Search from './search';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../toastConfig';
import AuthLoading from './AuthLoading';
import Reservacion from './reservacion';
import Payment from './payment';
import MisReservas from './MisReservas';
import HelpSupport from './helpSupport';
import DetalleReserva from './components/DetalleReserva';
import DetalleLugar from './components/DetalleLugar';
import Verify from './Verify';

import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};
const Stack = createStackNavigator();

export default function Navigation() {
  return (
<ClerkProvider publishableKey="pk_test_Zml0dGluZy1zZWFsLTIyLmNsZXJrLmFjY291bnRzLmRldiQ" tokenCache={tokenCache}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen 
          name="ChatScreen"
          component={ChatScreen}
          options={{ 
            headerTitle: "Toru - Asistente Turístico",
            headerStyle: { backgroundColor: '#3FCFB0' },
            headerTintColor: 'white'
          }}
        />
        <Stack.Screen name="MisReservas" component={MisReservas} />
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Site" component={Site} />
        <Stack.Screen name="DetalleLugar" component={DetalleLugar} />
        <Stack.Screen name="DetalleReserva" component={DetalleReserva} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Reservacion" component={Reservacion} />
        <Stack.Screen name="Verify" component={Verify} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast config={toastConfig}/> 
    
    </ClerkProvider>
  );
}
