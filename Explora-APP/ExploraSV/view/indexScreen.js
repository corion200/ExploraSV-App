import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import tw from './tw'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const IndexScreen = () => {
    return (
        <ScrollView style={tw`flex-1 bg-white p-4`}>
            <SafeAreaView>
                {/* Header */}
                <View style={tw`mb-4 flex-row justify-between items-center`}>
                    <View>
                        <Text style={tw`text-lg font-bold`}>Hola, [Nombre]!</Text>
                        <Text style={tw`text-sm text-gray-500`}>¿Qué aventura nos espera hoy?</Text>
                    </View>
                    <TouchableOpacity>
                        <Icon name="account-circle" size={40} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Banner */}
                <View style={tw`bg-blue-600 rounded-lg p-4 mb-4`}>
                    <Text style={tw`text-lg font-bold text-white`}>Reserva Ahora</Text>
                    <Text style={tw`text-sm text-white my-2`}>
                        Recibe una recompensa al hacer tu reserva con nosotros
                    </Text>
                    <TouchableOpacity style={tw`bg-yellow-400 p-2 rounded self-start flex-row items-center`}>
                        <Icon name="calendar-check" size={16} color="black" style={tw`mr-1`} />
                        <Text style={tw`text-sm font-bold text-black`}>Reservar</Text>
                    </TouchableOpacity>
                </View>

                {/* Categorías */}
                <Text style={tw`text-base font-bold my-2`}>Explora por categorías:</Text>
                <View style={tw`flex-row justify-between mb-4`}>
                    {[
                        { name: 'Senderismo', icon: 'hiking' },
                        { name: 'Playas', icon: 'beach' },
                        { name: 'Eco Turismo', icon: 'leaf' },
                        { name: 'Aventura', icon: 'compass' }
                    ].map((category, index) => (
                        <TouchableOpacity key={index} style={tw`items-center`}>
                            <View style={tw`w-12 h-12 bg-gray-200 rounded-full mb-2 items-center justify-center`}>
                                <Icon name={category.icon} size={24} color="#4B5563" />
                            </View>
                            <Text style={tw`text-xs text-center`}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lugares */}
                <Text style={tw`text-base font-bold my-2`}>Lugares que no te puedes perder:</Text>
                <View style={tw`mb-4`}>
                    {[
                        { name: 'Volcán de Izalco', location: 'Departamento de Sonsonate, El Salvador', icon: 'volcano' },
                        { name: 'El Boquerón', location: 'Departamento de San Salvador, El Salvador', icon: 'mountain' },
                    ].map((place, index) => (
                        <View key={index} style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg p-2`}>
                            <View style={tw`w-16 h-16 bg-gray-300 rounded-lg mr-2 items-center justify-center`}>
                                <Icon name={place.icon} size={32} color="#4B5563" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-sm font-bold`}>{place.name}</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Icon name="map-marker" size={12} color="#6B7280" style={tw`mr-1`} />
                                    <Text style={tw`text-xs text-gray-500`}>{place.location}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={tw`p-2`}>
                                <Icon name="heart-outline" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                
                {/* Botón flotante */}
                <TouchableOpacity 
                    style={tw`absolute bottom-4 right-4 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg`}
                    onPress={() => console.log('Búsqueda presionada')}
                >
                    <Icon name="magnify" size={28} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
};

export default IndexScreen;