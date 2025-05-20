import React from 'react';
import { View } from 'react-native';
import PlantillaSitio from './components/plantillaSitio';

export default function Site({ route }) {
  const { sitio } = route.params;

  const data = {
    image: sitio.Img || null,
    title: sitio.Nom_Siti || 'Título no disponible',
    puntaje: sitio.puntaje || 'N/A',
    location: sitio.location || 'Ubicación no disponible',
    descripcion: sitio.descripcion || 'Sin descripción',
    horario: sitio.horario || 'Horario no disponible',
    precios: sitio.precios || [],
    actividades: sitio.actividades || [],
    recomendaciones: sitio.recomendaciones || [],
  };

  return (
    <View style={{ flex: 1 }}>
      <PlantillaSitio {...data} />
    </View>
  );
}
