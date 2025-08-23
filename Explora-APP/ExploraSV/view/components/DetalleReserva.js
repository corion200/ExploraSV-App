import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from '../tw';

export default function DetalleReserva({ route, navigation }) {
  const { reserva } = route.params;
  
  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      <View style={[tw`px-6 py-4 flex-row items-center`, { backgroundColor: 'white' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[tw`ml-4 text-xl font-bold`, { color: colors.primary }]}>
          Detalle de Reserva
        </Text>
      </View>

      <ScrollView style={tw`flex-1 px-6 py-4`}>
        <View style={tw`bg-white rounded-2xl p-6`}>
          <Text style={[tw`text-2xl font-bold mb-4`, { color: colors.primary }]}>
            Reserva #{reserva.id}
          </Text>
          
          {/* Aquí puedes agregar más detalles de la reserva */}
          <Text style={[tw`text-base mb-2`, { color: colors.neutralDark }]}>
            <Text style={tw`font-bold`}>Estado:</Text> {reserva.Est_Rese}
          </Text>
          
          <Text style={[tw`text-base mb-2`, { color: colors.neutralDark }]}>
            <Text style={tw`font-bold`}>Fecha:</Text> {new Date(reserva.Fec_Rese).toLocaleDateString('es-ES')}
          </Text>
          
          {/* Más detalles... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
