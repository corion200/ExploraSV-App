import React from 'react';
import { View, Text, Image, ScrollView, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../tw';

const screenWidth = Dimensions.get('window').width;


const transformarDatosSitio = (datosRaw) => {
  return {
    
    image: datosRaw.imagen_url || null, 
    title: datosRaw.Nom_Siti || 'Título no disponible',
    puntaje: datosRaw.Punt ?? null,
    location: datosRaw.Activi_Siti || 'Ubicación no disponible',
    descripcion: datosRaw.Descrip_Siti || 'Descripción no disponible',
    horario:
      datosRaw.HoraI_Siti && datosRaw.HoraF_Siti
        ? `${datosRaw.HoraI_Siti.slice(0, 5)} - ${datosRaw.HoraF_Siti.slice(0, 5)}`
        : 'Horario no disponible',
    precios: [],        // Aquí podrías agregar precios si tienes info
    actividades: [],    // Igual para actividades, con iconos y etiquetas si quieres
    recomendaciones: datosRaw.Recomendacione_Siti,
  };
};

const plantillaSitio = ({
  image,
  title,
  puntaje,
  location,
  descripcion,
  horario,
  precios = [],
  actividades = [],
  recomendaciones = [],
}) => {
  console.log('Props plantillaSitio:', {
    image,
    title,
    puntaje,
    location,
    descripcion,
    horario,
    precios,
    actividades,
    recomendaciones,
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView style={tw`flex-1`}>
        {/* Imagen principal */}
      
        <Image
          source={{ uri: image || 'https://via.placeholder.com/400x250?text=Imagen+no+disponible' }}
          style={{ width: ' 100%', height: 310    }}
          resizeMode="cover"
        />

        {/* Contenido */}
        <View style={tw`bg-white rounded-[25px] -mt-5 p-4`}>
          <Text style={tw`text-xl font-bold`}>
            {title?.trim() || 'Título no disponible'} <Ionicons name="leaf-outline" size={18} color="green" />
          </Text>

          <Text style={tw`my-1`}>⭐ {puntaje ?? 'N/A'}</Text>
          <Text style={tw`text-gray-500`}>
            <Ionicons name="location-outline" /> {location?.trim() || 'Ubicación no disponible'}
          </Text>

          <Text style={tw`mt-3 mb-4`}>{descripcion?.trim() || 'Descripción no disponible.'}</Text>

          {/* Horario */}
          <Text style={tw`font-bold text-base mt-2`}>Horarios de visita:</Text>
          <Text style={tw`text-sm mt-1`}>{horario?.trim() || 'Horario no disponible'}</Text>

          {/* Precios */}
          <Text style={tw`font-bold text-base mt-4`}>Costo de entrada:</Text>
          <View style={tw`flex-row flex-wrap mt-2`}>
            {precios.length > 0 ? (
              precios.map((p, i) => (
                <Text key={i} style={tw`bg-green-100 text-green-800 px-3 py-1 rounded-lg mr-2 mb-2`}>
                  {p}
                </Text>
              ))
            ) : (
              <Text style={tw`text-gray-500`}>No hay información de precios</Text>
            )}
          </View>

          {/* Actividades */}
          <Text style={tw`font-bold text-base mt-4 `}>Atrévete a probar estas actividades:</Text>
          <View style={tw`flex-row flex-wrap mt-3 `}>
            {actividades.length > 0 ? (
              actividades.map((act, i) => (
                <View key={i} style={tw`items-center w-20 `}>
                  <Ionicons name={'ribbon-outline'} size={24} />
                  <Text style={tw`text-center mt-1 text-sm`}>{act.label || 'Actividad desconocida'}</Text>
                </View>
              ))
            ) : (
              <Text style={tw`text-gray-500`}>No hay actividades disponibles</Text>
            )}
          </View>
  
         <Text style={tw`font-bold text-base mt-4 text-center`}>¡Vive una mejor experiencia, con estas recomendaciones!</Text>
          {recomendaciones.length > 0 ? (
            <FlatList
              horizontal
              data={recomendaciones}
              renderItem={({ item  }) => (
                <View style={[tw`items-center mr-3 mb-20`, { width: screenWidth * 0.3 }]}>
                  <Image
                   source={require('../../assets/reco.png')} 
                    style={tw`w-full h-20 rounded-lg`}
                  />
                  <Text style={tw`mt-2 text-center text-sm`}>{item.caption || 'Sin descripción'}</Text>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              style={tw`mt-2 mb-4`}
            />
          ) : (
            <Text style={tw`text-gray-500`}>No hay recomendaciones por el momento</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export { plantillaSitio, transformarDatosSitio };
export default plantillaSitio;

