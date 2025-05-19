import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../tw'; 
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';//TODAVIA NO LO USO

export default function List({ navigation }) {

  const lugares = [
    {
      name: 'Volcán de Izalco',
      location: 'Departamento de Sonsonate, El Salvador',
      descripcion: 'Volcán joven y popular para hacer senderismo.',
      image: 'https://elsalvador.travel/wp-content/uploads/2021/01/Izalco.jpg',
      puntaje: 4.8,
      horario: '8:00 am - 4:00 pm',
      precios: ['$1.00', '$3.00'],
      actividades: ['Senderismo', 'Camping'],
      recomendaciones: [
        { image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png', caption: 'Ropa cómoda' },
        { image: 'https://cdn-icons-png.flaticon.com/512/3103/3103462.png', caption: 'Bloqueador solar' },
      ],
    },
  ];

  return (
    <View style={tw`mb-6`}>
      {lugares.map((place, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate('Site', { sitio: place })}
          style={tw`flex-row items-center mb-4 bg-white rounded-lg p-3 shadow-sm`}
        >
          <View style={tw`w-16 h-16 bg-gray-200 rounded-lg mr-3 items-center justify-center`}>
            <Icon name="image-outline" size={32} color="#4B5563" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-gray-800`}>{place.name}</Text>
            <View style={tw`flex-row items-center`}>
              <Icon name="map-marker" size={12} color="#6B7280" style={tw`mr-1`} />
              <Text style={tw`text-xs text-gray-600`}>{place.location}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#6B7280" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
