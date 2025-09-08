import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import BottomNavBar from './components/nav';
import { transformarDatosSitio } from './components/plantillaSitio';
import tw from './tw'; 
import api from '../api'; 
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILTERS = [
  { id: 'todos', label: 'todos' },
  { id: 'sitio_turistico', label: 'sitios_turisticos' },
  { id: 'hotel', label: 'hoteles' },
  { id: 'restaurante', label: 'restaurantes' },
];

const SearchApp = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const { t, i18n } = useTranslation();

  // Cargar todos los lugares al inicio
  useEffect(() => {
    api.get('/lugares')
      .then(res => setLugares(res.data.lugares))
      .catch(err => console.error('Error al cargar lugares:', err));
  }, []);

  // Cargar idioma desde AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('appLanguage');
      if (lang) i18n.changeLanguage(lang);
    };
    loadLanguage();
  }, []);

  // Buscar resultados según texto
  const fetchResults = async () => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }
  
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(searchText.trim())}`);
  
      const mapResultados = (items, tipo, tipo_display, campos) =>
        (items || []).map(item => ({
          id: item[campos.id] || item.id,
          nombre: item[campos.nombre] || 'Sin nombre',
          descripcion: item[campos.descripcion] || '',
          tipo,
          tipo_display,
          imagen: item[campos.imagen] || null,
          ...item,
        }));
  
      const combinedResults = [
        ...mapResultados(res.data.sitios, 'sitio_turistico', t('sitio_turistico'), {
          id: 'id',
          nombre: 'Nom_Siti',
          descripcion: 'Descrip_Siti',
          imagen: 'Imagen'
        }),
        ...mapResultados(res.data.hoteles, 'hotel', t('hotel'), {
          id: 'id',
          nombre: 'Nom_Hotel',
          descripcion: 'Descrip_Hotel',
          imagen: 'Imagen'
        }),
        ...mapResultados(res.data.restaurantes, 'restaurante', t('restaurante'), {
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
        const datosTransformados = transformarDatosSitio(item);
        navigation.navigate('Site', { sitio: datosTransformados });
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
            placeholder={t('search_placeholder')}
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
        <Text style={tw`text-white font-semibold text-sm`}>
          {t(filter.label)}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>
      </View>

      <View style={tw`px-4 mb-4`}>
        <Text style={tw`text-[#333333] text-sm`}>
          {t('results_found', { count: lugaresFiltrados.length })}
        </Text>
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
              {searchText.trim() !== '' ? t('no_results') : t('explore_places')}
            </Text>
            <Text style={tw`text-[#333333] text-base text-center`}>
              {searchText.trim() !== '' ? t('try_other_keywords') : ''}
            </Text>
          </View>
        )}
      />

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default SearchApp;
