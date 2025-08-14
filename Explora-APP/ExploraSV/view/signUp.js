import React, { useState } from 'react';
import tw from './tw'; 
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ScrollView,  SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { register } from '../auth'; 
import { Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';




const SignUp = () => {
  const [Nom_Cli, setNom_Cli] = useState('');
  const [Correo_Cli, setCorreo_Cli] = useState('');
  const [Contra_Cli, setContra_Cli] = useState('');
  const [Contra_Cli_confirmation, setContra_Cli_confirmation] = useState('');
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  
  const { isLoaded, signUp, setActive } = useSignUp();

  const handleRegister = async () => {
    if (!isLoaded) {
      return Toast.show({
        type: 'info',
        text1: 'Cargando...',
        text2: 'Espera un momento mientras preparamos el registro.',
        position: 'bottom'
      });
    }
  
    if (Contra_Cli !== Contra_Cli_confirmation) {
      return Toast.show({
        type: 'error',
        text1: 'Contraseñas no coinciden',
        text2: 'Por favor, verifica que ambas contraseñas sean iguales.',
        position: 'bottom'
      });
    }
  
    try {
      const result = await signUp.create({
        emailAddress: Correo_Cli.trim(),
        password: Contra_Cli,
      });
  
      console.log('Intento de registro creado:', result);

      console.log('Nombre guardado localmente');
  
      // Envía el código al email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
  
      // Registrar en tu backend (opcional antes de verificar email)
      await register(Nom_Cli, Correo_Cli.trim(), Contra_Cli, Contra_Cli_confirmation);
  
      // Navegar a pantalla Verify con el ID del intento
      await AsyncStorage.setItem('Turista', JSON.stringify({ Nom_Cli,  Correo_Cli }));
      Toast.show({
        type: 'success',
        text1: 'Cuenta creada 🎉',
        text2: 'Te hemos enviado un código de verificación a tu correo.',
        position: 'bottom'
      });

      // Ir a pantalla Verify
      navigation.navigate('Verify', { signUpId: result.id, email: Correo_Cli.trim() });
  
    } catch (error) {
      console.error('Error en registro:', error);
    
      let mensaje = error.errors?.[0]?.message || error.message || "Ocurrió un error";
    
      // Mostrar alerta diferente según el tipo de error
      if (/already in use/i.test(mensaje)) {
        Toast.show({
          type: 'error',
          text1: 'Correo ya registrado',
          text2: 'Este correo ya está registrado. Intenta iniciar sesión.',
          position: 'bottom'
        });
    
      } else if (/too short/i.test(mensaje)) {
        Toast.show({
          type: 'error',
          text1: 'Contraseña muy corta',
          text2: 'La contraseña debe tener al menos 8 caracteres.',
          position: 'bottom'
        });
    
      } else if (/invalid email/i.test(mensaje)) {
        Toast.show({
          type: 'error',
          text1: 'Correo inválido',
          text2: 'El formato de correo electrónico no es válido.',
          position: 'bottom'
        });
    
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registro fallido',
          text2: 'Ocurrió un error al registrar tu cuenta. Intenta nuevamente.',
          position: 'bottom'
        });
      }
    }
  };
  return (
    
    <SafeAreaView style={tw`flex-1 bg-black`}>
    <KeyboardAwareScrollView
      contentContainerStyle={tw`flex-grow justify-end bg-black`}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
     
      <StatusBar barStyle="light-content" />
      <View style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 justify-center items-center bg-black/30`}>
          <ScrollView contentContainerStyle={tw`flex-grow justify-end`} style={tw`w-full`}>
            <View style={tw`w-full bg-white rounded-t-3xl px-6 pt-5 pb-4`}>
              <View style={tw`items-center -mt-27`}>
                <View style={tw`bg-white rounded-full overflow-hidden`}>
                  <Image 
                    source={require('../assets/Favicon25.png')} 
                    style={{ width: 125, height: 125 }} // Tamaño fijo para mantener proporción
                    resizeMode="contain" // Ajusta bien sin distorsión
                  />
                </View>
              </View>
  
              <Text style={tw`text-xl font-bold text-center mb-3 text-gray-800`}>Crear Cuenta</Text>
  
              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Feather name="user" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Nombre y Apellido</Text>
                </View>
                <TextInput
                  placeholder="Nombre y apellido"
                  value={Nom_Cli}
                  onChangeText={setNom_Cli}
                  style={tw`border border-gray-300 rounded-lg p-2 text-base bg-gray-50`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
  
              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <MaterialCommunityIcons name="gmail" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Correo Electrónico</Text>
                </View>
                <TextInput
                  placeholder="ejemplo@gmail.com"
                  value={Correo_Cli}
                  onChangeText={setCorreo_Cli}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={tw`border border-gray-300 rounded-lg p-2 text-base bg-gray-50`}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
  
              <View style={tw`mb-8`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <AntDesign name="lock1" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Contraseña</Text>
                </View>
                <View style={tw`relative`}>
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Contraseña"
                    value={Contra_Cli}
                    onChangeText={setContra_Cli}
                    style={tw`border border-gray-300 rounded-lg p-2 text-base bg-gray-50`}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-4 top-3`}
                  >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
  
              <View style={tw`mb-8`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <AntDesign name="lock1" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Confirmar Contraseña</Text>
                </View>
                <View style={tw`relative`}>
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Confirmar contraseña"
                    value={Contra_Cli_confirmation}
                    onChangeText={setContra_Cli_confirmation}
                    style={tw`border border-gray-300 rounded-lg p-2 text-base bg-gray-50`}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-4 top-3`}
                  >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
  
              <TouchableOpacity style={tw`bg-primary py-3 rounded-xl shadow-md`} onPress={handleRegister}>
                <Text style={tw`text-white text-center font-bold text-lg`}>Registrar</Text>
              </TouchableOpacity>
  
              <View style={tw`flex-row justify-center mt-3 mb-10`}>
                <Text style={tw`text-gray-600`}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={tw`text-blue-800 font-semibold`}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
  
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAwareScrollView>
  </SafeAreaView>
  );
};

export default SignUp;