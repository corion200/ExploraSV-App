import React from 'react';
import { View, Text, Image, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../tw';

const screenWidth = Dimensions.get('window').width;

const plantillaSitio = ({
  image,
  title,
  puntaje,
  location,
  descripcion,
  horario,
  precios,
  actividades,
  recomendaciones,
}) => {
  return (
    <ScrollView style={tw`flex-1`}>
      {/* Imagen principal */}
      <Image source={{ uri: image }} style={{ width: '100%', height: 250 }} />

      {/* Contenido */}
      <View style={tw`bg-white rounded-t-3xl -mt-5 p-4`}>
        <Text style={tw`text-xl font-bold`}>
          {title} <Ionicons name="leaf-outline" size={18} color="green" />
        </Text>

        <Text style={tw`my-1`}>⭐ {puntaje}</Text>
        <Text style={tw`text-gray-500`}><Ionicons name="location-outline" /> {location}</Text>

        <Text style={tw`mt-3 mb-4`}>{descripcion}</Text>

        {/* Horario */}
        <Text style={tw`font-bold text-base mt-2`}>Horarios de visita:</Text>
        <Text style={tw`text-sm mt-1`}>{horario}</Text>

        {/* Precios */}
        <Text style={tw`font-bold text-base mt-4`}>Costo de entrada:</Text>
        <View style={tw`flex-row flex-wrap mt-2`}>
          {precios.map((p, i) => (
            <Text key={i} style={tw`bg-green-100 text-green-800 px-3 py-1 rounded-lg mr-2 mb-2`}>
              {p}
            </Text>
          ))}
        </View>

        {/* Actividades */}
        <Text style={tw`font-bold text-base mt-4`}>¡Atrévete a probar estas actividades!</Text>
        <View style={tw`flex-row flex-wrap mt-3`}>
          {actividades.map((act, i) => (
            <View key={i} style={tw`items-center w-20 mb-4`}>
              <Ionicons name={act.icon} size={24} />
              <Text style={tw`text-center mt-1 text-sm`}>{act.label}</Text>
            </View>
          ))}
        </View>

        {/* Recomendaciones (carrusel) */}
        <Text style={tw`font-bold text-base mt-4`}>¡Vive una mejor experiencia!</Text>
        <FlatList
          horizontal
          data={recomendaciones}
          renderItem={({ item }) => (
            <View style={[tw`items-center mr-3`, { width: screenWidth * 0.6 }]}>
              <Image source={{ uri: item.image }} style={tw`w-full h-24 rounded-lg`} />
              <Text style={tw`mt-2 text-center text-sm`}>{item.caption}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={tw`mt-2 mb-4`}
        />
      </View>
    </ScrollView>
  );
};

export default plantillaSitio;
