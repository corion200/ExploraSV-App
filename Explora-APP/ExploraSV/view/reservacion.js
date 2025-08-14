// Reservacion.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PlantillaReservacion from "./components/plantillaReservacion";
import tw from './tw';

export default function Reservacion({ route, navigation }) {
  const { tipoLugar, datosLugar } = route.params || {};

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header con botón de regreso */}
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`mr-3`}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Nueva Reserva</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-6`}
      >
        {/* Información del lugar */}
        <View style={tw`bg-blue-50 m-4 p-4 rounded-2xl`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-2`}>
            📍 {datosLugar?.nombre ?? 'Lugar no especificado'}
          </Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons 
              name={tipoLugar === 'hotel' ? 'bed' : tipoLugar === 'restaurante' ? 'restaurant' : 'location'} 
              size={16} 
              color="#6b7280" 
            />
            <Text style={tw`text-gray-600 ml-1 capitalize`}>
              {tipoLugar ?? 'No especificado'}
            </Text>
          </View>
        </View>

        {/* Componente de reservación */}
        <PlantillaReservacion tipoLugar={tipoLugar} data={datosLugar} />
      </ScrollView>
    </SafeAreaView>
  );
}
