import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from '../tw';
import api from '../../api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function List({ navigation }) {
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    api.get('/lugares')
      .then(res => setLugares(res.data.lugares.slice(0, 6)))
      .catch(err => console.error('Error al cargar lugares:', err));
  }, []);

  const obtenerIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'hotel': return 'bed';
      case 'restaurante': return 'silverware-fork-knife';
      default: return 'map-marker';
    }
  };

  return (
    <View style={tw`mb-6`}>
      {lugares.map((place, index) => (
        <TouchableOpacity
          key={`indexscreen-lugar-${place.id}-${index}`}
          onPress={() => {
            if (place.tipo === 'sitio_turistico') {
              navigation.navigate('Site', {
                sitio: {
                  ...place,
                  Id_Siti: place.id,
                  Nom_Siti: place.nombre,
                  Descrip_Siti: place.descripcion,
                  Img: place.imagen
                }
              });
            } else {
              navigation.navigate('DetalleLugar', {
                lugar: place,
                tipo: place.tipo
              });
            }
          }}
          style={tw`flex-row items-center mb-4 bg-white rounded-xl p-4 shadow-sm border border-[#3333331A]`}
          activeOpacity={0.7}
        >
          <View style={tw`w-16 h-16 bg-[#F5F5F5] rounded-lg mr-4 items-center justify-center overflow-hidden`}>
            {place.imagen ? (
              <Image
                source={{ uri: place.imagen }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <Icon name="image-off-outline" size={28} color="#9CA3AF" />
            )}
          </View>
          
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-bold text-[#333333] mb-1`}>
              {place.nombre}
            </Text>
            <View style={tw`flex-row items-center`}>
              <Icon
                name={obtenerIconoPorTipo(place.tipo)}
                size={14}
                color="#D4AF37"
                style={tw`mr-2`}
              />
              <Text style={tw`text-sm text-[#333333]`}>
                {place.tipo_display}
              </Text>
            </View>
          </View>
          
          <Icon name="chevron-right" size={24} color="#569298" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
