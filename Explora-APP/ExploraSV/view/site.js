import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from './tw';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const Site = () => {
    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <ScrollView contentContainerStyle={tw`flex-grow`} style={tw`w-full`}>
                {/* Imagen del lugar */}
                <Image
                    source={{ uri: '#' }} // Reemplaza con la imagen
                    style={tw`w-full h-64`}
                />

                {/* Contenido del sitio */}
                <View style={tw`w-full bg-white rounded-t-3xl px-6 pt-5 pb-8`}>
                    {/* Título y favoritos */}
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={tw`text-2xl font-bold text-gray-800`}>Volcan de Izalco</Text>
                        <TouchableOpacity>
                            <AntDesign name="hearto" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>

                    {/* Ubicación y descripción */}
                    <Text style={tw`text-gray-600 mb-4`}>
                        Ubicación: Departamento de Sonsonate, El Salvador
                    </Text>
                    <Text style={tw`text-gray-600 mb-6`}>
                        Acércate a conocer el volcán más joven de El Salvador y del mundo, el cual se mantiene activo y
                        representa todo un reto para los turistas.
                    </Text>

                    {/* Horarios */}
                    <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>Horarios de visita:</Text>
                    <Text style={tw`text-gray-600 mb-4`}>8:00 am - 4:00 pm</Text>

                    {/* Costos */}
                    <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>Costo de entrada:</Text>
                    <View style={tw`flex-row justify-between mb-6`}>
                        <TouchableOpacity style={tw`bg-green-500 px-4 py-2 rounded-lg`}>
                            <Text style={tw`text-white font-bold`}>$1.00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`bg-green-500 px-4 py-2 rounded-lg`}>
                            <Text style={tw`text-white font-bold`}>$3.00</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Actividades */}
                    <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
                        ¡Atrévete a probar todas las actividades que están a tu alcance!
                    </Text>
                    <View style={tw`flex-row justify-between mb-6`}>
                        <View style={tw`items-center`}>
                            <MaterialCommunityIcons name="hiking" size={32} color="gray" />
                            <Text style={tw`text-gray-600 mt-2`}>Senderismo</Text>
                        </View>
                        <View style={tw`items-center`}>
                            <MaterialCommunityIcons name="campfire" size={32} color="gray" />
                            <Text style={tw`text-gray-600 mt-2`}>Camping</Text>
                        </View>
                        <View style={tw`items-center`}>
                            <MaterialCommunityIcons name="bike" size={32} color="gray" />
                            <Text style={tw`text-gray-600 mt-2`}>Ciclismo</Text>
                        </View>
                    </View>

                    {/* Recomendaciones */}
                    <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
                        Vive una mejor experiencia, siguiendo estas recomendaciones:
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default Site;