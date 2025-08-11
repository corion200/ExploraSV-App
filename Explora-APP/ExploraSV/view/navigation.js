import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './App';
import SignUp from './signUp';
import Index from './indexScreen';
import Login from './login';
import Site from './site';
import Perfil from './perfil';
import Search from './search';
import AuthLoading from './AuthLoading';
import Reservacion from './reservacion';
import Payment from './payment';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Site" component={Site} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Reservacion" component={Reservacion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
