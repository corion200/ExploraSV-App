import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from './components/nav';
import List from "./components/InfoViews";
import tw from './tw'; 
import api from '../api'; 

const SearchApp  = ({ navigation }) => {
  
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  // Función para buscar en la API
  const fetchResults = async () => {
    try {
      if (!searchText || searchText.trim() === '') {
        setResults([]);
        return;
      }
      const res = await api.get(`/busqueda?q=${searchText}`);
      setResults(res.data.data.sitio || []); // <-- aquí accedemos a "sitio"
    } catch (err) {
      console.error('Error en búsqueda:', err);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 pt-13`}>
      <StatusBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4`}
      >
        {/* Search Bar */}
        <View style={tw`relative mb-4`}>
          <View style={tw`absolute left-3 top-3 z-10`}>
            <Ionicons name="search" size={20} color="#10B981" />
          </View>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar playas..."
            style={tw`bg-gray-200 rounded-lg py-3 pl-12 pr-4 text-gray-900`}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Botón de búsqueda */}
        <TouchableOpacity
          onPress={fetchResults}
          style={tw`bg-green-500 py-3 rounded-lg mb-6 items-center`}
        >
          <Text style={tw`text-white font-semibold`}>Buscar</Text>
        </TouchableOpacity>

        {/* Results Header */}
        <Text style={tw`text-gray-900 font-semibold text-lg mb-4`}>
          Resultado de la búsqueda
        </Text>

        {/* Results List */}
        <List results={results} navigation={navigation} />
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default SearchApp;