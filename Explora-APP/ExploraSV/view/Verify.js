import React, { useState } from 'react';
import tw from './tw';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSignUp } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; 

const Verify = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { signUpId, email } = route.params;

  const [code, setCode] = useState('');
  const { signUp, setActive, isLoaded } = useSignUp();

  const handleVerify = async () => {
    if (!isLoaded) return;
  
    try {
      // Verificación usando el objeto signUp actual
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      
  
      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
        // Aquí puedes llamar a tu backend y navegar
        navigation.reset({ login: 0, routes: [{ name: 'Index' }] });
      } else {
        Alert.alert('Error', 'Código incorrecto o expirado');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.errors?.[0]?.message || err.message || 'Ocurrió un error');
    }
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={tw`flex-grow justify-end bg-black`}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" />
      <View style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 justify-center items-center bg-black/30`}>
          <ScrollView contentContainerStyle={tw`flex-grow justify-end`} style={tw`w-full`}>
            <View style={tw`w-full bg-white rounded-t-3xl px-6 pt-5 pb-8`}>
              <View style={tw`items-center -mt-24`}>
                <Image source={require('../assets/Favicon25.png')} style={tw`w-43 h-44`} />
              </View>

              <Text style={tw`text-xl font-bold text-center mb-8 text-gray-800`}>
                Verificar tu cuenta
              </Text>

              <Text style={tw`text-center text-gray-500 mb-4`}>
                Hemos enviado un código a {email}
              </Text>

              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <MaterialCommunityIcons name="email-check-outline" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Código de verificación</Text>
                </View>
                <TextInput
                  placeholder="Ingresa el código"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  style={tw`border border-gray-300 rounded-xl p-4 text-base bg-gray-50`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity style={tw`bg-primary py-4 rounded-xl shadow-md`} onPress={handleVerify}>
                <Text style={tw`text-white text-center font-bold text-lg`}>Verificar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Verify;
