import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import tw from './tw';
import BottomNavBar from './components/nav';
import PlantillaSitio, { transformarDatosSitio } from './components/plantillaSitio';

export default function Site({ route, navigation }) { // ⭐ Agregar navigation
  const { sitio } = route.params;
  
  console.log('=== DATOS INICIALES EN SITE ===');
  console.log('Sitio recibido en params:', JSON.stringify(sitio, null, 2));
  
  const [datosSitioCompleto, setDatosSitioCompleto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== INICIANDO FETCH ===');
    console.log('Tipo de sitio:', sitio.tipo);
    console.log('ID del sitio:', sitio.Id_Siti || sitio.id);
    
    // Determinar el endpoint según el tipo
    let endpoint = '';
    const id = sitio.Id_Siti || sitio.id;
    
    if (sitio.tipo === 'hotel') {
      endpoint = `http://192.168.1.17:8000/api/hoteles/${id}`;
    } else if (sitio.tipo === 'restaurante') {
      endpoint = `http://192.168.1.17:8000/api/restaurantes/${id}`; // ⭐ Corregido puerto
    } else {
      endpoint = `http://192.168.1.17:8000/api/sitios/${id}`;
    }

    console.log('Endpoint calculado:', endpoint);

    fetch(endpoint)
      .then((response) => {
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.json();
      })
      .then((dataCompleta) => {
        console.log('=== DATA RECIBIDA DEL BACKEND ===');
        console.log(JSON.stringify(dataCompleta, null, 2));
        
        // Transforma datos para adaptarlos a PlantillaSitio
        const datosTransformados = transformarDatosSitio(dataCompleta);
        console.log('=== DATOS DESPUÉS DE TRANSFORMAR ===');
        console.log('Tipo final:', datosTransformados.tipo);
        console.log('Mostrar botón reserva:', datosTransformados.mostrarBotonReserva);
        console.log(JSON.stringify(datosTransformados, null, 2));
        
        setDatosSitioCompleto(datosTransformados);
        setLoading(false);
      })
      .catch((err) => {
        console.error('=== ERROR EN FETCH ===');
        console.error('Error completo:', err);
        console.error('Error message:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, [sitio.Id_Siti || sitio.id, sitio.tipo]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 pt-12`}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <PlantillaSitio 
            {...datosSitioCompleto} 
            navigation={navigation} // ⭐ Pasar navigation
          />
        </ScrollView>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}
