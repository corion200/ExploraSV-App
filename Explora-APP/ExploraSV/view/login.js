import React, { useState, useEffect } from 'react';
import tw from './tw'; 
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { login, getCurrentUser } from '../auth'; 
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

const SignIn = () => {
  const navigation = useNavigation();
  const [Correo_Cli, setCorreo_Cli] = useState('');
  const [Contra_Cli, setContra_Cli] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Verificamos si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentUser();
      if (session) {
        navigation.navigate('Index');
      }
    };
    checkSession();
  }, []);

// Agrega esta función en SignIn.js, antes de handleLogin
const validateForm = () => {
  const newErrors = {};
  
  const emailError = validateEmail(Correo_Cli);
  const passwordError = validatePassword(Contra_Cli);
  
  if (emailError) newErrors.email = emailError;
  if (passwordError) newErrors.password = passwordError;
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // Validación en tiempo real con mensajes de Toru
const validateEmail = (email) => {
  if (!email.trim()) {
    return '🐦 ¡Oye! Toru necesita tu correo para poder ayudarte';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '🐦 Mmm... Toru dice que ese correo no se ve bien. ¿Podrías revisarlo?';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password) {
    return '🐦 ¡Hey! Toru no puede dejarte pasar sin tu contraseña';
  }
  if (password.length < 6) {
    return '🐦 Toru dice que tu contraseña necesita al menos 6 caracteres para ser segura';
  }
  return null;
};

const handleLogin = async () => {
  // Validar antes de enviar
  if (!validateForm()) {
    Toast.show({
      type: 'error',
      text1: '🐦 ¡Espera un momento!',
      text2: 'Toru notó que faltan algunos datos importantes.',
      position: 'bottom'
    });
    return;
  }

  setIsLoading(true);

  const result = await login(Correo_Cli.trim(), Contra_Cli, navigation);

  if (result) {
    Toast.show({
      type: 'success',
      text1: '🐦 ¡Toru está feliz! 🎉',
      text2: 'Te ha dado la bienvenida correctamente.',
      position: 'bottom'
    });
  } else {
    Toast.show({
      type: 'error',
      text1: '🐦 ¡Ups! Toru dice...',
      text2: 'Esos datos no coinciden con lo que tiene en su memoria.',
      position: 'bottom'
    });
  }

  setIsLoading(false);
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
                <View style={tw`bg-white rounded-full`}>
                  <Image 
                    source={require('../assets/Favicon25.png')} 
                    style={tw`w-43 h-44`} 
                  />
                </View>
              </View>
              
              <Text style={tw`text-xl font-bold text-center mb-8 text-gray-800`}>Iniciar Sesión</Text>
              
              {/* Campo Email */}
              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <MaterialCommunityIcons name="gmail" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Correo Electrónico</Text>
                </View>
                <TextInput
                  placeholder="ejemplo@gmail.com"
                  value={Correo_Cli}
                  onChangeText={(text) => {
                    setCorreo_Cli(text);
                    // Limpiar error al escribir
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: null }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    tw`border rounded-xl p-4 text-base bg-gray-50`,
                    errors.email ? tw`border-red-400` : tw`border-gray-300`
                  ]}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.email && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>{errors.email}</Text>
                )}
              </View>
              
              {/* Campo Contraseña */}
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
                    onChangeText={(text) => {
                      setContra_Cli(text);
                      // Limpiar error al escribir
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: null }));
                      }
                    }}
                    style={[
                      tw`border rounded-xl p-4 text-base bg-gray-50`,
                      errors.password ? tw`border-red-400` : tw`border-gray-300`
                    ]}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-4 top-4`}
                  >
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>{errors.password}</Text>
                )}
              </View>

              {/* Botón Login */}
              <TouchableOpacity 
                style={[
                  tw`bg-primary py-4 rounded-xl shadow-md`,
                  isLoading && tw`opacity-70`
                ]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={tw`text-white text-center font-bold text-lg`}>
                  {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Text>
              </TouchableOpacity>

              {/* Link registro */}
              <View style={tw`flex-row justify-center mt-6`}>
                <Text style={tw`text-gray-600`}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={tw`text-blue-800 font-semibold mb-3`}>Registrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
