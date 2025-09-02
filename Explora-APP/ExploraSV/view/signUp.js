import React, { useState } from 'react';
import tw from './tw'; 
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { register } from '../auth'; 
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigation = useNavigation();
  const { isLoaded, signUp, setActive } = useSignUp();


  

// Agrega esta función en SignUp.js, antes de handleRegister
const validateForm = () => {
  const newErrors = {};
  
  const nameError = validateName(Nom_Cli);
  const emailError = validateEmail(Correo_Cli);
  const passwordError = validatePassword(Contra_Cli);
  const confirmError = validatePasswordConfirmation(Contra_Cli, Contra_Cli_confirmation);
  
  if (nameError) newErrors.name = nameError;
  if (emailError) newErrors.email = emailError;
  if (passwordError) newErrors.password = passwordError;
  if (confirmError) newErrors.passwordConfirm = confirmError;
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


// Validaciones individuales sin estilo infantil
const validateName = (name) => {
  if (!name.trim()) {
    return 'Debe ingresar un nombre.';
  }
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.';
  }
  return null;
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
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'La contraseña debe incluir al menos una letra minúscula.';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'La contraseña debe incluir al menos una letra mayúscula.';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  return null;
};

const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) {
    return 'Debe confirmar su contraseña.';
  }
  if (password !== confirmation) {
    return 'Las contraseñas no coinciden.';
  }
  return null;
};

const handleRegister = async () => {
  if (!isLoaded) {
    return Toast.show({
      type: 'info',
      text1: 'Preparando el registro',
      text2: 'Espere un momento mientras se organizan los datos.',
      position: 'bottom'
    });
  }

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

  try {
    const result = await signUp.create({
      emailAddress: Correo_Cli.trim(),
      password: Contra_Cli,
    });

    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

    const backendResult = await register(
      Nom_Cli.trim(), 
      Correo_Cli.trim(), 
      Contra_Cli, 
      Contra_Cli_confirmation
    );
    
    if (backendResult && backendResult.success === false) {
      Toast.show({
        type: 'error',
        text1: 'Error en el registro',
        text2: backendResult.message || 'Ocurrió un problema en el proceso.',
        position: 'bottom'
      });
      setIsLoading(false);
      return;
    }

    await AsyncStorage.setItem('Turista', JSON.stringify({ 
      Nom_Cli: Nom_Cli.trim(), 
      Correo_Cli: Correo_Cli.trim() 
    }));

    Toast.show({
      type: 'success',
      text1: 'Registro exitoso',
      text2: 'Se ha enviado un código de verificación a su correo.',
      position: 'bottom'
    });

    navigation.navigate('Verify', { 
      signUpId: result.id, 
      email: Correo_Cli.trim() 
    });

  } catch (error) {
    console.log('Error en registro Clerk:', error);

    let mensaje = error.errors?.[0]?.message || error.message || "Ocurrió un error";

    // Manejo formal de errores
    if (/already in use/i.test(mensaje) || /identifier already exists/i.test(mensaje)) {
      Toast.show({
        type: 'error',
        text1: 'Correo en uso',
        text2: 'El correo ingresado ya está registrado. Intente iniciar sesión.',
        position: 'bottom'
      });
    } else if (/password.*too.*short/i.test(mensaje) || /password.*weak/i.test(mensaje)) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña débil',
        text2: 'La contraseña debe ser más segura, incluyendo mayúsculas, números y símbolos.',
        position: 'bottom'
      });
    } else if (/invalid.*email/i.test(mensaje) || /email.*invalid/i.test(mensaje)) {
      Toast.show({
        type: 'error',
        text1: 'Correo inválido',
        text2: 'El formato del correo electrónico no es correcto.',
        position: 'bottom'
      });
    } else if (/password.*found/i.test(mensaje)) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña insegura',
        text2: 'La contraseña ingresada es demasiado común. Use una más segura.',
        position: 'bottom'
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error inesperado',
        text2: 'Ocurrió un problema. Intente nuevamente.',
        position: 'bottom'
      });
    }
  } finally {
    setIsLoading(false);
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
                      style={{ width: 125, height: 125 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <Text style={tw`text-xl font-bold text-center mb-3 text-gray-800`}>Crear Cuenta</Text>

                {/* Campo Nombre */}
                <View style={tw`mb-5`}>
                  <View style={tw`flex-row items-center mb-2`}>
                    <Feather name="user" size={20} color="#4B5563" style={tw`mr-2`} />
                    <Text style={tw`text-gray-700 font-medium`}>Nombre y Apellido</Text>
                  </View>
                  <TextInput
                    placeholder="Nombre y apellido"
                    value={Nom_Cli}
                    onChangeText={(text) => {
                      setNom_Cli(text);
                      if (errors.name) {
                        setErrors(prev => ({ ...prev, name: null }));
                      }
                    }}
                    style={[
                      tw`border rounded-lg p-2 text-base bg-gray-50`,
                      errors.name ? tw`border-red-400` : tw`border-gray-300`
                    ]}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.name && (
                    <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>{errors.name}</Text>
                  )}
                </View>

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
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: null }));
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      tw`border rounded-lg p-2 text-base bg-gray-50`,
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
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: null }));
                        }
                      }}
                      style={[
                        tw`border rounded-lg p-2 text-base bg-gray-50`,
                        errors.password ? tw`border-red-400` : tw`border-gray-300`
                      ]}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={tw`absolute right-4 top-3`}
                    >
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>{errors.password}</Text>
                  )}
                </View>

                {/* Campo Confirmar Contraseña */}
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
                      onChangeText={(text) => {
                        setContra_Cli_confirmation(text);
                        if (errors.passwordConfirm) {
                          setErrors(prev => ({ ...prev, passwordConfirm: null }));
                        }
                      }}
                      style={[
                        tw`border rounded-lg p-2 text-base bg-gray-50`,
                        errors.passwordConfirm ? tw`border-red-400` : tw`border-gray-300`
                      ]}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={tw`absolute right-4 top-3`}
                    >
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  {errors.passwordConfirm && (
                    <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>{errors.passwordConfirm}</Text>
                  )}
                </View>

                {/* Botón Registro */}
                <TouchableOpacity 
                  style={[
                    tw`bg-primary py-3 rounded-xl shadow-md`,
                    isLoading && tw`opacity-70`
                  ]} 
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text style={tw`text-white text-center font-bold text-lg`}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                  </Text>
                </TouchableOpacity>

                {/* Link Login */}
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