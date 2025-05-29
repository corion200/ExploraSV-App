import React from 'react';
import { View } from 'react-native';
import PlantillaSitio from './components/plantillaSitio';

export default function Site({ route }) {
  const { sitio } = route.params;

  console.log('Sitio completo:', sitio);

  const horario = sitio.hora_inicio && sitio.hora_fin
    ? `${sitio.hora_inicio} - ${sitio.hora_fin}`
    : 'Horario no disponible';

  const actividades = sitio.Activi_Siti
    ? sitio.Activi_Siti.split(',').map(act => ({ icon: 'walk-outline', label: act.trim() }))
    : [];

  const precios = sitio.Precio_Siti
    ? sitio.Precio_Siti.split(',').map(p => p.trim())
    : [];

  const data = {
    image: sitio.Img || null,
    title: sitio.Nom_Siti || 'Título no disponible',
    puntaje: sitio.Punt || 'N/A',
    location: sitio.Ubicacion || 'Ubicación no disponible',
    descripcion: sitio.Descripcion || 'Sin descripción',
    horario,
    precios,
    actividades,
    recomendaciones: Array.isArray(sitio.recomendaciones) ? sitio.recomendaciones : [],
  };

  return (
    <View style={{ flex: 1 }}>
      <PlantillaSitio {...data} />
    </View>
  );
}
