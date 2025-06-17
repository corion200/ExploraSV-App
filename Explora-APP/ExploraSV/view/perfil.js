import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView,StatusBar  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from './tw';
import BottomNavBar from './components/nav';



const ConfiguracionesScreen = () => {
  const menuItems = [
    { title: 'Membresías', icon: 'card-outline', highlighted: true },
    { title: 'Tus favoritos', icon: 'heart-outline' },
    { title: 'Puntos acumulados', icon: 'trophy-outline' },
    { title: 'Historial de pago', icon: 'time-outline' },
    { title: 'Modo Claro', icon: 'sunny-outline', hasToggle: true },
  ];
  

  return (
    <SafeAreaView style={tw`flex-1`}>
    <StatusBar barStyle="light-content" backgroundColor="#101C5D" />
      <ScrollView style={tw`flex-1`}>
        {/* Header con perfil */}
        <View style={tw`bg-[#101C5D] px-6 h-94 rounded-b-3xl`}>
          <Text style={tw`text-xl  text-white pt-14 mb-10`}>
            Configuraciones
          </Text>
          
          <View style={tw`items-center`}>
            {/* Imagen de perfil */}
            <View style={tw`w-24 h-24 rounded-full bg-pink-200 mb-4 overflow-hidden`}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
                }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            
            <Text style={tw`text-white text-lg font-semibold mb-1`}>
              Nombre: Johanna Portillo
            </Text>
            <Text style={tw`text-white opacity-80 text-base mb-4`}>
              Correo: ejemplo@gmail.com
            </Text>
            
            {/* Botón Editar */}
            <TouchableOpacity style={tw`bg-teal-400 px-6 py-2 rounded-full`}>
              <Text style={tw` font-semibold`}>
                Editar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de opciones */}
        <View style={tw`px-4 py-6`}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center justify-between p-4 mb-3 rounded-xl`}
            >
              <View style={tw`flex-row items-center`}>
                <Ionicons 
                  name={item.icon} 
                  size={24} 
                  
                />
                <Text style={tw`ml-3 text-lg` }>
                  {item.title}
                </Text>
              </View>
              
              {item.hasToggle ? (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="sunny-outline" size={20} color="#6b7280" />
                  <View style={tw`w-12 h-6 bg-gray-300 rounded-full ml-2 relative`}>
                    <View style={tw`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm`} />
                  </View>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar 
                  />
    </SafeAreaView>
  );
};

export default ConfiguracionesScreen;