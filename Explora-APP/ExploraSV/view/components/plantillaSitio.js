// components/PlantillaSitio.js
import React from 'react';
import { View, Text, Image, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../tw';
import Comentario from "./reviewSitio";

const screenWidth = Dimensions.get('window').width;

const transformarDatosSitio = (datosRaw) => {
  return {
    Id_Siti: datosRaw.Id_Siti || datosRaw.id || null,
    image: datosRaw.image || datosRaw.imagen || datosRaw.Img || null,
    title: datosRaw.title || datosRaw.nombre || datosRaw.Nom_Siti || datosRaw.Nom_Hotel || datosRaw.Nom_Rest || 'No especificado',
    puntaje: datosRaw.puntaje || 'N/A',
    location: datosRaw.location || datosRaw.ubicacion || datosRaw.Ubi_Siti || 'No especificado',
    descripcion: datosRaw.descripcion || datosRaw.Descrip_Siti || datosRaw.Descrip_Hotel || datosRaw.Descrip_Rest || 'No especificado',
    horario: datosRaw.horario || (datosRaw.HoraI_Siti && datosRaw.HoraF_Siti
      ? `${datosRaw.HoraI_Siti} - ${datosRaw.HoraF_Siti}`
      : null),
    precios: datosRaw.precios || [],
    actividades: datosRaw.actividades || [],
    recomendaciones: Array.isArray(datosRaw.Recomendacione_Siti) 
      ? datosRaw.Recomendacione_Siti
      : datosRaw.Recomendacione_Siti
        ? [{ caption: datosRaw.Recomendacione_Siti }]
        : [],
    tipo: datosRaw.tipo || 'sitio_turistico',
  };
};

const PlantillaSitio = (props) => {
  const {
    Id_Siti,
    image,
    title,
    puntaje,
    location,
    descripcion,
    horario,
    precios = [],
    actividades = [],
    recomendaciones = [],
    tipo = 'sitio_turistico',
    navigation
  } = props;

  // Normalización para asegurar datos correctos
  const displayNombre = title || props.nombre || props.Nom_Siti || props.Nom_Hotel || props.Nom_Rest || 'No especificado';
  const displayDescripcion = descripcion || props.Descrip_Siti || props.Descrip_Hotel || props.Descrip_Rest || 'No especificado';
  const displayUbicacion = location || props.ubicacion || props.Ubi_Siti || 'No especificado';
  const displayImagenObj = image 
    ? (typeof image === 'string' ? { uri: image } : image)
    : props.imagen
      ? { uri: props.imagen }
      : require('../../assets/default-image.png');

  return (
    <View style={tw`flex-1`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen principal */}
        <Image
          source={displayImagenObj}
          style={tw`w-full h-64`}
          resizeMode="cover"
        />

        {/* Contenido principal */}
        <View style={tw`bg-white rounded-t-[25px] -mt-5 p-4`}>
          <Text style={tw`text-xl font-bold`}>
            {displayNombre} <Ionicons name="leaf-outline" size={18} color="green" />
          </Text>

          <Text style={tw`my-1`}>⭐ {puntaje}</Text>
          <Text style={tw`text-gray-500`}>
            <Ionicons name="location-outline" /> {displayUbicacion}
          </Text>

          <Text style={tw`mt-3 mb-4`}>
            {displayDescripcion}
          </Text>

          {/* Botón de reserva */}
          {(tipo === 'hotel' || tipo === 'restaurante') && navigation && (
            <TouchableOpacity
              style={tw`bg-green-600 px-6 py-3 rounded-lg mb-4 items-center`}
              onPress={() =>
                navigation.navigate('Reservacion', {
                  tipoLugar: tipo,
                  datosLugar: {
                    id: Id_Siti || props.id,
                    nombre: displayNombre,
                    descripcion: displayDescripcion,
                    imagen: displayImagenObj.uri || null,
                    ubicacion: displayUbicacion
                  }
                })
              }
            >
              <Text style={tw`text-white font-bold text-lg`}>
                🏨 Reservar {tipo === 'hotel' ? 'Hotel' : 'Mesa'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Horario */}
          {horario && (
            <>
              <Text style={tw`font-bold text-base mt-2`}>Horarios de visita:</Text>
              <Text style={tw`text-sm mt-1`}>{horario}</Text>
            </>
          )}

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
          <Text style={tw`font-bold text-base mt-4`}>Atrévete a probar estas actividades:</Text>
          <View style={tw`flex-row flex-wrap mt-3`}>
            {actividades.length > 0 ? (
              actividades.map((act, i) => (
                <View key={i} style={tw`items-center w-20`}>
                  <Ionicons name={'ribbon-outline'} size={24} />
                  <Text style={tw`text-center mt-1 text-sm`}>{act.label || 'Actividad desconocida'}</Text>
                </View>
              ))
            ) : (
              <Text style={tw`text-gray-500`}>No hay actividades disponibles</Text>
            )}
          </View>

          {/* Recomendaciones */}
          <Text style={tw`font-bold text-base mt-4 text-center mb-4`}>
            ¡Vive una mejor experiencia, con estas recomendaciones!
          </Text>
          {recomendaciones.length > 0 ? (
            <FlatList
              horizontal
              data={recomendaciones}
              renderItem={({ item }) => (
                <View style={[tw`items-center mr-3`, { width: screenWidth * 0.3 }]}>
                  <Image
                    source={item.image ? { uri: item.image } : require('../../assets/reco.png')}
                    style={tw`w-full h-20 rounded-lg`}
                  />
                  <Text style={tw`mt-2 text-center text-sm`}>
                    {item.caption || 'Sin descripción'}
                  </Text>
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

        {/* Comentarios */}
        <Comentario Id_Siti={Id_Siti} />
      </ScrollView>
    </View>
  );
};

export { PlantillaSitio, transformarDatosSitio };
export default PlantillaSitio;
