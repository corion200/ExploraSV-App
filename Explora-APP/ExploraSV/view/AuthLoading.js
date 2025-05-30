import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoading = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const Pcarga = await AsyncStorage.getItem('Turista');
      if (Pcarga === 'true') {
        navigation.replace('Index'); // Pantalla principal
      } else {
        navigation.replace('Login'); // Pantalla de login
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoading;