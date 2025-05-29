import React, { useState, useEffect, StatusBar } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Button } from 'react-native';
import tw from './tw'; 
import List from "./components/InfoViews";
import BottomNavBar from './components/nav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../auth';



const IndexScreen = ({ navigation }) => {

    const [Nom_Cli, setNom_Cli] = useState('');
    const handleTabChange = (tabId) => {
      console.log(`Pestaña seleccionada: ${tabId}`);
      // Implementa aquí tu lógica de navegación
    };
    useEffect(() => {
      const obtenerNombre = async () => {
        try {
            const usuario = await AsyncStorage.getItem('Turista');
            if (usuario) {
              const usuarioParseado = JSON.parse(usuario);
              console.log('Usuario recuperado:', usuarioParseado);
              setNom_Cli(usuarioParseado.Nom_Cli);
            }
          } catch (error) {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        };
      obtenerNombre();
    }, []);

    //cerrar sesión 
    const cerrarSesion = async () => {
        try {
          await logout(navigation);
        } catch (error) {
          console.error('Error al cerrar sesión:', error.message);
        }
      };
  
    return (
       
            <SafeAreaView style={tw`flex-1  p-4`}>
              <ScrollView comoponetStyle={tw`p-1 pb-28`}>
                {/* Header */}
                <View style={tw`mb-6 flex-row justify-between items-center`}>
                    <View>
                        <Text style={tw`text-xl font-bold text-gray-800`}> Hola, {Nom_Cli ? Nom_Cli : 'Turista'}!</Text>
                        <Text style={tw`text-sm text-gray-600`}>¿Qué aventura nos espera hoy?</Text>
                    </View>
                    <View style={tw`items-center`}>
                        <Icon name="account-circle" size={40} color="#6B7280" />
                        <Button title="Cerrar sesión" color="red" onPress={cerrarSesion} />
                    </View>
                </View>

                {/* Banner */}
                <View style={tw`bg-[#101C5D] rounded-lg p-5 mb-6 shadow-md`}>
                    <Text style={tw`text-lg font-bold text-white`}>Reserva Ahora</Text>
                    <Text style={tw`text-sm text-white my-2`}>
                        Recibe una recompensa al hacer tu reserva con nosotros
                    </Text>
                    <TouchableOpacity style={tw`bg-[#3FCFB0] px-4 py-2 rounded-full self-start flex-row items-center`}>
                        <Icon name="calendar-check" size={16} color="black" style={tw`mr-2`} />
                        <Text style={tw`text-sm font-bold text-black`}>Reservar</Text>
                    </TouchableOpacity>
                </View>

                {/* Categorías */}
                <Text style={tw`text-base font-bold text-gray-800 mb-4`}>Explora por categorías:</Text>
                <View style={tw`flex-row justify-between mb-6`}>
                    {[
                        { name: 'Senderismo', icon: 'hiking' },
                        { name: 'Playas', icon: 'beach' },
                        { name: 'Eco Turismo', icon: 'leaf' },
                        { name: 'Aventura', icon: 'compass' }
                    ].map((category, index) => (
                        <TouchableOpacity key={index} style={tw`items-center`}>
                            <View style={tw`w-14 h-14 bg-gray-200 rounded-full mb-2 items-center justify-center shadow-sm`}>
                                <Icon name={category.icon} size={28} color="#4B5563" />
                            </View>
                            <Text style={tw`text-xs text-center text-gray-700`}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lugares */}
                <Text style={tw`text-base font-bold text-gray-800 mb-4`}>Lugares que no te puedes perder:</Text>
                <List navigation={navigation} />
              </ScrollView>
              {/* Afuera del area del scroll para que se quede fijo*/}
                <BottomNavBar 
                  onTabChange={handleTabChange}
                />
            </SafeAreaView>

        
    );
};

export default IndexScreen;
