import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import BottomNavBar from './components/nav';
import { transformarDatosSitio } from './components/plantillaSitio'; // Importa la función
import tw from './tw'; 
import api from '../api'; 

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'sitio_turistico', label: 'Sitios turísticos' },
  { id: 'hotel', label: 'Hoteles' },
  { id: 'restaurante', label: 'Restaurantes' },
];

const SearchApp = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  // Cargar todos los lugares al inicio
  useEffect(() => {
    api.get('/lugares')
      .then(res => setLugares(res.data.lugares))
      .catch(err => console.error('Error al cargar lugares:', err));
  }, []);

  // Buscar resultados según texto
  const fetchResults = async () => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }
  
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(searchText.trim())}`);
  
      // Función auxiliar para mapear resultados de cualquier tipo
      const mapResultados = (items, tipo, tipo_display, campos) =>
        (items || []).map(item => ({
          id: item[campos.id] || item.id,
          nombre: item[campos.nombre] || 'Sin nombre',
          descripcion: item[campos.descripcion] || '',
          tipo,
          tipo_display,
          imagen: item[campos.imagen] || null,
          ...item, // mantener todos los campos originales para transformarDatosSitio
        }));
  
      const combinedResults = [
        ...mapResultados(res.data.sitios, 'sitio_turistico', 'Sitio turístico', {
          id: 'id',
          nombre: 'Nom_Siti',
          descripcion: 'Descrip_Siti',
          imagen: 'Imagen'
        }),
        ...mapResultados(res.data.hoteles, 'hotel', 'Hotel', {
          id: 'id',
          nombre: 'Nom_Hotel',
          descripcion: 'Descrip_Hotel',
          imagen: 'Imagen'
        }),
        ...mapResultados(res.data.restaurantes, 'restaurante', 'Restaurante', {
          id: 'id',
          nombre: 'Nom_Rest',
          descripcion: 'Descrip_Rest',
          imagen: 'Imagen'
        }),
      ];
  
      setResults(combinedResults);
    } catch (err) {
      console.error('Error en búsqueda:', err);
    }
  };

  const obtenerIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'hotel': return 'bed';
      case 'restaurante': return 'silverware-fork-knife';
      default: return 'map-marker';
    }
  };

  // Filtrar según el texto y el tipo
  const datosAMostrar = searchText.trim() !== '' ? results : lugares;
  const lugaresFiltrados = filtro === 'todos' ? datosAMostrar : datosAMostrar.filter(l => l.tipo === filtro);
    

    const renderLugar = ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          const datosTransformados = transformarDatosSitio(item); // Transformar antes de enviar
          navigation.navigate('Site', {
            sitio: datosTransformados
          });
        }}
        style={tw`bg-white rounded-2xl shadow-md p-0 mb-5 border border-[#3333331A] overflow-hidden`}
        activeOpacity={0.8}
      >
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={tw`w-full h-48 rounded-t-2xl`}
            resizeMode="cover"
          />
        ) : (
          <View style={tw`w-full h-48 bg-[#F5F5F5] rounded-t-2xl items-center justify-center`}>
            <Icon name="image-off-outline" size={40} color="#9CA3AF" />
          </View>
        )}
    
        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-start mb-3`}>
            <Text style={tw`text-[#101C5D] font-bold text-lg flex-1 mr-3`} numberOfLines={2}>
              {item.nombre}
            </Text>
            <View style={tw`flex-row items-center rounded-full border border-[#D4AF37] px-3 py-1 bg-[#FFF8E1]`}>
              <Icon name={obtenerIconoPorTipo(item.tipo)} size={14} color="#D4AF37" />
              <Text style={tw`text-[#D4AF37] font-semibold text-xs ml-1 capitalize`}>
                {item.tipo_display}
              </Text>
            </View>
          </View>
          <Text style={tw`text-[#333333] text-sm leading-5`} numberOfLines={3}>
            {item.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F5F5F5] pt-13`}>
      <StatusBar />
      <View style={tw`px-4 mb-4`}>
        <View style={tw`relative mb-4`}>
          <View style={tw`absolute left-3 top-3 z-10`}>
            <Ionicons name="search" size={20} color="#569298" />
          </View>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar lugares, playas, hoteles..."
            style={tw`bg-white rounded-lg py-3 pl-12 pr-4 text-[#333333] border border-[#569298]/30 shadow-sm`}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            onSubmitEditing={fetchResults}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-1`}>
          {FILTERS.map(filter => {
            const activo = filtro === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setFiltro(filter.id)}
                style={tw`${activo ? 'bg-[#101C5D]' : 'bg-[#569298]'} px-5 py-3 rounded-full mr-3 shadow-sm`}
                activeOpacity={0.8}
              >
                <Text style={tw`text-white font-semibold text-sm`}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={tw`px-4 mb-4`}>
        <Text style={tw`text-[#333333] text-sm`}>{lugaresFiltrados.length} lugares encontrados</Text>
      </View>

      <FlatList
        data={lugaresFiltrados}
        renderItem={renderLugar}
        keyExtractor={(item, index) => `searchscreen-item-${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-4 pb-24`}
        ListEmptyComponent={() => (
          <View style={tw`mt-10 items-center`}>
            <Icon name="map-search-outline" size={48} color="#569298" style={tw`mb-3`} />
            <Text style={tw`text-[#101C5D] text-lg font-semibold mb-2`}>
              {searchText.trim() !== '' ? 'No se encontraron resultados' : 'Explora lugares increíbles'}
            </Text>
            <Text style={tw`text-[#333333] text-base text-center`}>
              {searchText.trim() !== '' ? 'Prueba con otra palabra clave o revisa los filtros' : 'Usa la búsqueda o filtros para descubrir destinos'}
            </Text>
          </View>
        )}
      />

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default SearchApp;