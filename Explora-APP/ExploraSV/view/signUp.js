import React, { useState } from 'react';
import tw from './tw'; 
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1`}
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
              
              <Text style={tw`text-xl font-bold text-center mb-8 text-gray-800`}>Crear Cuenta</Text>
              
              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Feather name="user" size={20} color="#4B5563" style={tw`mr-2`} />
                  <Text style={tw`text-gray-700 font-medium`}>Nombre Completo</Text>
                </View>
                <TextInput
                  placeholder="Nombre completo"
                  value={fullName}
                  onChangeText={setFullName}
                  style={tw`border border-gray-300 rounded-xl p-4 text-base bg-gray-50`}
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
                  value={email}
                  onChangeText={setEmail}
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
                    value={password}
                    onChangeText={setPassword}
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
              
              <TouchableOpacity style={tw`bg-primary py-4 rounded-xl shadow-md`}>
                <Text style={tw`text-white text-center font-bold text-lg`}>Registrar</Text>
              </TouchableOpacity>
              
              {/* Login Link */}
              <View style={tw`flex-row justify-center mt-6`}>
                <Text style={tw`text-gray-600`}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity>
                  <Text style={tw`text-blue-800 font-semibold`}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;