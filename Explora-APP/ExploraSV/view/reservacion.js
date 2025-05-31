import React from "react";
import { View, Text, ScrollView } from "react-native";
import PlantillaReservacion from "./components/plantillaReservacion";

export default function Reservacion({ route }) {
  const { tipoLugar, datosLugar } = route.params || {};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Tipo de lugar: {tipoLugar ?? 'No especificado'}
      </Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Nombre del lugar: {datosLugar?.nombre ?? 'No especificado'}
      </Text>

      <PlantillaReservacion tipoLugar={tipoLugar} data={datosLugar} />
    </ScrollView>
  );
}
