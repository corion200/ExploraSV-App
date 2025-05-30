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
    const recomendaciones = sitio.Recomendacione_Siti
  ? sitio.Recomendacione_Siti.split(',').map((rec, i) => ({
      image: 'https://via.placeholder.com/150x96?text=Recomendación', // puedes personalizar esto
      caption: rec.trim(),
    }))
  : [];

    const data = {
    image: sitio.imagen_url || null,
    title: sitio.Nom_Siti || 'Título no disponible',
    puntaje: sitio.Punt || 'N/A',
    location: sitio.Ubicacion || 'Ubicación no disponible',
    descripcion: sitio.	Descrip_Siti || 'Sin descripción',
    horario:
    sitio.HoraI_Siti && sitio.HoraF_Siti
    ? `${sitio.HoraI_Siti.slice(0, 5)} - ${sitio.HoraF_Siti.slice(0, 5)}`
    : 'Horario no disponible',
    precios,
    actividades,
    recomendaciones
  };

  return (
    <View style={{ flex: 1 }}>
      <PlantillaSitio {...data} />
    </View>
  );
}


