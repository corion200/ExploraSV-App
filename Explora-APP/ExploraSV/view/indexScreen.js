import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import tw from './tw'; 
import List from "./components/InfoViews";
import { useIsFocused } from '@react-navigation/native';
import BottomNavBar from './components/nav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndexScreen = ({ navigation }) => {
    const [Nom_Cli, setNom_Cli] = useState('');
    const isFocused = useIsFocused();
    
    useEffect(() => {
      if (isFocused) {
        const obtenerNombre = async () => {
          try {
            const usuario = await AsyncStorage.getItem('Turista');
            if (usuario) {
              const usuarioParseado = JSON.parse(usuario);
              setNom_Cli(usuarioParseado.Nom_Cli);
            }
          } catch (error) {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        };
        obtenerNombre();
      }
    }, [isFocused]);

    const categories = [
        { id: 'senderismo', name: 'Senderismo', icon: 'hiking', screen: 'Senderismo' },
        { id: 'playas', name: 'Playas', icon: 'umbrella-beach', screen: 'Playas' },
        { id: 'eco-turismo', name: 'Eco Turismo', icon: 'leaf', screen: 'EcoTurismo' },
        { id: 'aventura', name: 'Aventura', icon: 'compass', screen: 'Aventura' }
    ];

    const handleCategoryPress = (category) => {
        navigation.navigate(category.screen);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-[#F5F5F5]`}>
          <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
          
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={tw`pb-24`}
            style={tw`flex-1`}
          >
            {/* Header mejorado */}
            <View style={tw`bg-white px-6 py-4 mb-4 shadow-sm`}>
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-2xl font-bold text-[#101C5D] mb-1`}>
                    ¡Hola, {Nom_Cli ? Nom_Cli : 'Turista'}!
                  </Text>
                  <Text style={tw`text-base text-[#333333]`}>
                    ¿Qué aventura nos espera hoy?
                  </Text>
                </View>
                
                <View style={tw`ml-4`}>
                  <View style={tw`w-16 h-16 rounded-full border-2 border-[#569298] overflow-hidden`}>
                    <Image
                      source={require('../assets/Favicon25.png')}
                      style={tw`w-full h-full`}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={tw`px-6`}>
              {/* Banner mejorado */}
              <View style={tw`bg-[#101C5D] rounded-2xl p-6 mb-8 shadow-lg`}>
                <View style={tw`flex-row items-center mb-3`}>
                  <Icon name="star" size={24} color="#D4AF37" style={tw`mr-2`} />
                  <Text style={tw`text-xl font-bold text-white`}>Reserva Ahora</Text>
                </View>
                
                <Text style={tw`text-white mb-4 text-base leading-relaxed`}>
                  Recibe una recompensa especial al hacer tu reserva con nosotros y vive experiencias únicas
                </Text>
                
                <TouchableOpacity 
                  style={tw`bg-[#D4AF37] px-6 py-3 rounded-full self-start flex-row items-center shadow-md`}
                  onPress={() => navigation.navigate('MisReservas')}
                  activeOpacity={0.8}
                >
                  <Icon name="calendar-check" size={18} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-base font-bold text-white`}>Mis Reservas</Text>
                </TouchableOpacity>
              </View>

              {/* Categorías mejoradas */}
              <View style={tw`mb-8`}>
                <Text style={tw`text-xl font-bold text-[#101C5D] mb-6`}>
                  Explora por categorías
                </Text>
                
                <View style={tw`flex-row justify-between`}>
                  {categories.map((category) => (
                    <TouchableOpacity 
                      key={category.id}
                      style={tw`items-center flex-1 mx-1`}
                      onPress={() => handleCategoryPress(category)}
                      activeOpacity={0.7}
                    >
                      <View style={tw`w-16 h-16 bg-white rounded-2xl mb-3 items-center justify-center shadow-md border border-[#569298]/20`}>
                        <Icon name={category.icon} size={28} color="#569298" />
                      </View>
                      <Text style={tw`text-sm text-center text-[#333333] font-medium`}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Sección de lugares mejorada */}
              <View style={tw`mb-4`}>
                <View style={tw`flex-row justify-between items-center mb-6`}>
                  <Text style={tw`text-xl font-bold text-[#101C5D]`}>
                    Lugares imperdibles
                  </Text>
                  
                  <TouchableOpacity 
                    style={tw`flex-row items-center`}
                    onPress={() => navigation.navigate('Search')}
                  >
                    <Text style={tw`text-sm text-[#569298] font-medium mr-1`}>Ver todos</Text>
                    <Icon name="chevron-right" size={16} color="#569298" />
                  </TouchableOpacity>
                </View>
                
                <List navigation={navigation} />
              </View>
            </View>
          </ScrollView>
          
          <BottomNavBar />
        </SafeAreaView>
    );
};

export default IndexScreen;
