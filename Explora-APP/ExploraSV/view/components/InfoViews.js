import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from '../tw';
import api from '../../api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function List({ navigation, results }) {
  const [sitios, setSitios] = useState([]);

  useEffect(() => {
    // Si recibimos resultados de búsqueda, no hacemos la petición automática
    if (results) return;

    api.get('/sitios')
      .then(res => setSitios(res.data))
      .catch(err => console.error('Error al cargar sitios:', err));
  }, [results]);

  // Si hay resultados de búsqueda, los usamos; si no, usamos la carga normal
  const dataToShow = results || sitios; 

  return (
    <View style={tw`mb-6`}>
      {dataToShow.length > 0 ? (
        dataToShow.map((place, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Site', {
              sitio: {
                ...place,
                Id_Siti: place.Id_Siti,
              },
            })}
            style={tw`flex-row items-center mb-4 bg-white rounded-lg p-3 shadow-sm`}
          >
            <View style={tw`w-16 h-16 bg-gray-200 rounded-lg mr-3 items-center justify-center overflow-hidden`}>
              {place.imagen_url ? (
                <Image
                  source={{ uri: place.imagen_url }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              ) : (
                <Icon name="image-off-outline" size={32} color="#9CA3AF" />
              )}
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-bold text-gray-800`}>
                {place.Nom_Siti}
              </Text>
              <View style={tw`flex-row items-center`}>
                <Icon name="map-marker" size={12} color="#6B7280" style={tw`mr-1`} />
                <Text style={tw`text-xs text-gray-600`}>Ver información</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={tw`text-gray-600 text-center`}>No hay resultados</Text>
      )}
    </View>
  );
}
