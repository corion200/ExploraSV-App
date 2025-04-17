import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import tw from './tw'; 
import { SafeAreaView } from 'react-native-safe-area-context';

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
                    <View style={tw`w-10 h-10 bg-gray-300 rounded-full`}></View>
                </View>

                {/* Banner */}
                <View style={tw`bg-blue-600 rounded-lg p-4 mb-4`}>
                    <Text style={tw`text-lg font-bold text-white`}>Reserva Ahora</Text>
                    <Text style={tw`text-sm text-white my-2`}>
                        Recibe una recompensa al hacer tu reserva con nosotros
                    </Text>
                    <TouchableOpacity style={tw`bg-yellow-400 p-2 rounded self-start`}>
                        <Text style={tw`text-sm font-bold text-black`}>Reservar</Text>
                    </TouchableOpacity>
                </View>

                {/* Categorías */}
                <Text style={tw`text-base font-bold my-2`}>Explora por categorías:</Text>
                <View style={tw`flex-row justify-between mb-4`}>
                    {['Senderismo', 'Playas', 'Eco Turismo', 'Aventura'].map((category, index) => (
                        <TouchableOpacity key={index} style={tw`items-center`}>
                            <View style={tw`w-10 h-10 bg-gray-300 rounded-full mb-2`}></View>
                            <Text style={tw`text-xs text-center`}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lugares */}
                <Text style={tw`text-base font-bold my-2`}>Lugares que no te puedes perder:</Text>
                <View style={tw`mb-4`}>
                    {[
                        { name: 'Volcán de Izalco', location: 'Departamento de Sonsonate, El Salvador' },
                        { name: 'El Boquerón', location: 'Departamento de San Salvador, El Salvador' },
                    ].map((place, index) => (
                        <View key={index} style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg p-2`}>
                            <View style={tw`w-16 h-16 bg-gray-300 rounded-lg mr-2`}></View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-sm font-bold`}>{place.name}</Text>
                                <Text style={tw`text-xs text-gray-500`}>{place.location}</Text>
                            </View>
                            <TouchableOpacity style={tw`p-2`}>
                                <View style={tw`w-6 h-6 bg-gray-300 rounded-full`}></View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default IndexScreen;