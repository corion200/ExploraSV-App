import React, { useState, useEffect } from 'react';
import tw from './tw'; 
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { login, getCurrentUser } from '../auth'; 
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const SignIn = () => {
  const navigation = useNavigation();
  const [Correo_Cli, setCorreo_Cli] = useState('');
  const [Contra_Cli, setContra_Cli] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    const user = await login(Correo_Cli, Contra_Cli);

    if (user) {
      navigation.navigate('Index');
    } else {
      setErrorMessage('Credenciales incorrectas');
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
              <View style={tw`items-center -mt-24 `}>
                <View style={tw`bg-white rounded-full `}>
                  <Image 
                    source={require('../assets/Favicon25.png')} 
                    style={tw`w-43 h-44`} 
                  />
                </View>
              </View>
              
              <Text style={tw`text-xl font-bold text-center mb-8 text-gray-800`}>Iniciar Sesión</Text>
              
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
                  style={tw`border border-gray-300 rounded-xl p-4 text-base bg-gray-50`}
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
                    style={tw`border border-gray-300 rounded-xl p-4 text-base bg-gray-50`}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-4 top-4`}
                  >
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={tw`bg-primary py-4 rounded-xl shadow-md`} onPress={handleLogin}>
                <Text style={tw`text-white text-center font-bold text-lg`}>Iniciar Sesión</Text>
              </TouchableOpacity>

              
              {/* registro Link */}
              <View style={tw`flex-row justify-center mt-6`}>
                <Text style={tw`text-gray-600`}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} >
                  <Text style={tw`text-blue-800 font-semibold`}>Registrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      </KeyboardAwareScrollView>  );
};

export default SignIn;