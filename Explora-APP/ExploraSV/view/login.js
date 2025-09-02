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

  // Verifica si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentUser();
      if (session) {
        navigation.navigate('Index');
      }
    };
    checkSession();
  }, []);


const validateForm = () => {
  const newErrors = {};
  
  const emailError = validateEmail(Correo_Cli);
  const passwordError = validatePassword(Contra_Cli);
  
  if (emailError) newErrors.email = emailError;
  if (passwordError) newErrors.password = passwordError;
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const validateEmail = (email) => {
  if (!email.trim()) {
    return 'Debe ingresar un correo electrónico.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del correo electrónico no es válido.';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password) {
    return 'Debe ingresar una contraseña.';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  return null;
};

const handleLogin = async () => {
  // Validar antes de enviar
  if (!validateForm()) {
    Toast.show({
      type: 'error',
      text1: 'Error de validación',
      text2: 'Por favor complete los campos requeridos correctamente.',
      position: 'bottom'
    });
    return;
  }

  setIsLoading(true);

  const result = await login(Correo_Cli.trim(), Contra_Cli, navigation);

  if (result) {
    Toast.show({
      type: 'success',
      text1: 'Acceso concedido',
      text2: 'Ha iniciado sesión correctamente.',
      position: 'bottom'
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Credenciales inválidas',
      text2: 'El correo o la contraseña no coinciden.',
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