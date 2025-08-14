import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from '../tw';
import api from '../../api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function List({ navigation }) {
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    // ✅ Cambio principal: ahora usa /lugares en vez de /sitios
    api.get('/lugares')
      .then(res => setLugares(res.data.lugares)) // ✅ accede a data.lugares
      .catch(err => console.error('Error al cargar lugares:', err));
  }, []);

  return (
    <View style={tw`mb-6`}>
      {lugares.map((place, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // ✅ Navegación diferenciada por tipo
            if (place.tipo === 'sitio_turistico') {
              navigation.navigate('Site', {
                sitio: {
                  ...place,
                  Id_Siti: place.id, // ✅ usa el id correcto
                  Nom_Siti: place.nombre,
                  Descrip_Siti: place.descripcion,
                  Img: place.imagen
                }
              });
            } else {
              // Para hoteles y restaurantes, navega a una pantalla general de detalle
              navigation.navigate('DetalleLugar', { 
                lugar: place,
                tipo: place.tipo 
              });
            }
          }}
          style={tw`flex-row items-center mb-4 bg-white rounded-lg p-3 shadow-sm`}
        >
          <View style={tw`w-16 h-16 bg-gray-200 rounded-lg mr-3 items-center justify-center overflow-hidden`}>
            {place.imagen ? (
              <Image
                source={{ uri: place.imagen }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <Icon name="image-off-outline" size={32} color="#9CA3AF" />
            )}
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-gray-800`}>
              {place.nombre}
            </Text>
            <View style={tw`flex-row items-center`}>
              <Icon 
                name={
                  place.tipo === 'hotel' 
                    ? 'bed' 
                    : place.tipo === 'restaurante' 
                    ? 'silverware-fork-knife' 
                    : 'map-marker'
                } 
                size={12} 
                color="#6B7280" 
                style={tw`mr-1`} 
              />
              <Text style={tw`text-xs text-gray-600`}>
                {place.tipo_display}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#6B7280" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
