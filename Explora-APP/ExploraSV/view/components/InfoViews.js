import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../tw'; 
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';//TODAVIA NO LO USO
export default function List() {

    return (
        
        <View style={tw`mb-6`}>
        {[
            { name: 'Volcán de Izalco', location: 'Departamento de Sonsonate, El Salvador',  },
        ].map((place, index) => (
            <View key={index} style={tw`flex-row items-center mb-4 bg-white rounded-lg p-3 shadow-sm`}>
                <View style={tw`w-16 h-16 bg-gray-200 rounded-lg mr-3 items-center justify-center`}>
                    <Icon  size={32} color="#4B5563" />
                </View>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-sm font-bold text-gray-800`}>{place.name}</Text>
                    <View style={tw`flex-row items-center`}>
                        <Icon name="map-marker" size={12} color="#6B7280" style={tw`mr-1`} />
                        <Text style={tw`text-xs text-gray-600`}>{place.location}</Text>
                    </View>
                </View>
                <TouchableOpacity style={tw`p-2`}>
                    <Icon name="heart-outline" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>
        ))}
        </View>
    );
  }