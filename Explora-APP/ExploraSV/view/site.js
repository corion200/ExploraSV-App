import React from 'react';
import tw from './tw'; 
import { View, ScrollView, SafeAreaView } from 'react-native';
import BottomNavBar from './components/nav';
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
    Id_Siti: sitio.Id_Siti || null,
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
    <SafeAreaView style={tw`flex-1 pt-12`}>
      <View style={{ flex: 1 }}>
        <ScrollView  showsVerticalScrollIndicator={false}  >
          <PlantillaSitio {...data} />
        </ScrollView>
        <BottomNavBar 
        />
      </View>
    </SafeAreaView>
    
    
    
  );
}


