// components/DetalleLugar.js
import React from 'react';
import PlantillaSitio from './plantillaSitio';

export default function DetalleLugar({ route, navigation }) {
  const { lugar } = route.params;

  return (
    <PlantillaSitio 
      {...lugar} 
      tipo={lugar.tipo}
      navigation={navigation} // ✅ pasa navigation para el botón de reserva
    />
  );
}
