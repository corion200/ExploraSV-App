import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from './components/nav';
import List from "./components/InfoViews";
import tw from './tw'; 

const SearchApp = (navigation) => {
  const [searchText, setSearchText] = useState('joya');


  return (
    <SafeAreaView style={tw`flex-1 pt-13`}>
      <StatusBar barStyle="dark-content" backgroundColor="#101C5D" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4`} // Corregido: era "comoponetStyle"
      >
        {/* Header personalizado con saludo */}
       
      

        {/* Location selector */}
       

        {/* Search Bar */}
        <View style={tw`relative mb-6`}>
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

        {/* Results Header */}
        <Text style={tw`text-gray-900 font-semibold text-lg mb-4`}>
          Resultado de la búsqueda
        </Text>

        {/* Results List */}
        <List   navigation={navigation} />
      </ScrollView>
      <BottomNavBar 
                  />
    </SafeAreaView>
  );
};

export default SearchApp;