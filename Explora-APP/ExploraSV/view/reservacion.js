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
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-6`}
      >
        {/* Componente de reservación */}
        <PlantillaReservacion tipoLugar={tipoLugar} data={datosLugar} />
      </ScrollView>
    </SafeAreaView>
  );
}
