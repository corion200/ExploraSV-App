import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './App';
import SignUp from './signUp';
import Index from './indexScreen';
import Login from './login';
import Site from './site';
import Perfil from './perfil';
import { ClerkProvider } from '@clerk/clerk-expo';
import Search from './search';
import Verify from './Verify';
import Toast from 'react-native-toast-message';
import AuthLoading from './AuthLoading';
import Reservacion from './reservacion';
import Payment from './payment';
import DetalleLugar from './components/DetalleLugar';
import Verify from './Verify';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

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
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Site" component={Site} />
        <Stack.Screen name="DetalleLugar" component={DetalleLugar} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Reservacion" component={Reservacion} />
        <Stack.Screen name="Verify" component={Verify} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast /> 
    
    </ClerkProvider>
  );
}
