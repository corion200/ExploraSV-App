import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import tw from './tw'; 
import List from "./components/InfoViews";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndexScreen = () => {

    const [Nom_Cli, setNom_Cli] = useState('');

    useEffect(() => {
      const obtenerNombre = async () => {
        try {
            const usuario = await AsyncStorage.getItem('Turista');
            if (usuario) {
              const usuarioParseado = JSON.parse(usuario);
              console.log('Usuario recuperado:', usuarioParseado);  // Verifica la estructura
              setNom_Cli(usuarioParseado.Nom_Cli); // Asegúrate de que la propiedad 'nombre' esté presente
            }
          } catch (error) {
            console.error('Error al obtener el nombre del usuario:', error);
          }
        };
      
  
      obtenerNombre();
    }, []);
  
    return (
        <ScrollView style={tw`flex-1 bg-gray-50`}>
            <SafeAreaView style={tw`p-4`}>
                {/* Header */}
                <View style={tw`mb-6 flex-row justify-between items-center`}>
                    <View>
                        <Text style={tw`text-xl font-bold text-gray-800`}> Hola, {Nom_Cli ? Nom_Cli : 'Cargando...'}!</Text>
                        <Text style={tw`text-sm text-gray-600`}>¿Qué aventura nos espera hoy?</Text>
                    </View>
                    <TouchableOpacity>
                        <Icon name="account-circle" size={40} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Banner */}
                <View style={tw`bg-blue-500 rounded-lg p-5 mb-6 shadow-md`}>
                    <Text style={tw`text-lg font-bold text-white`}>Reserva Ahora</Text>
                    <Text style={tw`text-sm text-white my-2`}>
                        Recibe una recompensa al hacer tu reserva con nosotros
                    </Text>
                    <TouchableOpacity style={tw`bg-yellow-400 px-4 py-2 rounded-full self-start flex-row items-center`}>
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
                <List/>

                {/* Botón flotante */}
                <TouchableOpacity 
                    style={tw`absolute bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg`}
                    onPress={() => console.log('Búsqueda presionada')}
                >
                    <Icon name="magnify" size={28} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
};

export default IndexScreen;