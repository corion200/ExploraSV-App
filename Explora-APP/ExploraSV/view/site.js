// Site.js
import React from 'react';
import { useRoute } from '@react-navigation/native';
import PlantillaSitio from './components/plantillaSitio';

const Site = () => {
  const route = useRoute();
  const { sitio } = route.params;

  return (
    <PlantillaSitio
      image={sitio.image}
      title={sitio.title}
      puntaje={sitio.puntaje}
      location={sitio.location}
      descripcion={sitio.descripcion}
      horario={sitio.horario}
      precios={sitio.precios}
      actividades={sitio.actividades}
      recomendaciones={sitio.recomendaciones}
    />
  );
};

export default Site;
