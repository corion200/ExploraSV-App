import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView,StatusBar  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from './tw';
import { updateProfile,getCurrentUser } from '../auth'; 
import BottomNavBar from './components/nav';
import { logout } from '../auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';





const ConfiguracionesScreen = ( ) => {
  const navigation = useNavigation();
  
  const menuItems = [
    { title: 'Membresías', icon: 'card-outline', highlighted: true },
    { title: 'Tus favoritos', icon: 'heart-outline' },
    { title: 'Puntos acumulados', icon: 'trophy-outline' },
    { title: 'Cerrar Sesión', icon: 'exit-outline' },
   
  ];
 
  // Estados para los valores, pueden venir de props o API
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(user);
      setUser(updatedUser);
  
      // Guarda en AsyncStorage el usuario actualizado
      await AsyncStorage.setItem('Turista', JSON.stringify(updatedUser));
  
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  }
  
  
  const cerrarSesion = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('Turista');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white pb-20`}>
    <StatusBar barStyle="light-content" backgroundColor="#101C5D" />
      <ScrollView style={tw`flex-1`}>
        {/* Header con perfil */}
        <View style={tw`bg-[#101C5D] px-6 h-103 rounded-b-3xl`}>
          <Text style={tw`text-xl  text-white pt-10 mb-10`}>
            Configuraciones
          </Text>
          
          <View style={tw`items-center`}>
            {/* Imagen de perfil */}
            <View style={tw`w-24 h-24 rounded-full bg-pink-200 mb-4 overflow-hidden`}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
                }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            {isEditing ? (
            <>
            <Text style={tw`text-white text-base opacity-80 font-semibold mb-1`}>Nombre: </Text>
            <TextInput
                style={tw`bg-white rounded px-3 py-2 mb-2`}
                value={user?.Nom_Cli || ''}
                onChangeText={(text) => setUser({ ...user, Nom_Cli: text })}
              />

            <Text style={tw`text-white text-base opacity-80 font-semibold mb-1`}>Correo</Text>
              <TextInput
                style={tw`bg-white rounded px-3 py-2 mb-2`}
                value={user?.Correo_Cli || ''}
                onChangeText={(text) => setUser({ ...user, Correo_Cli: text })}
              />
              <TouchableOpacity
                style={tw`bg-teal-400 px-6 py-2 rounded-full`}
                onPress={handleSave} 
              >
                <Text style={tw`text-white font-semibold text-center`}>Guardar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
            <Text style={tw`text-white text-base opacity-80 font-semibold mb-1`}>Nombre: </Text>
            <Text style={tw`text-white text-lg font-bold mb-1`}> {user?.Nom_Cli || ''}</Text>
        
            <Text style={tw`text-white text-base opacity-80 font-semibold mb-1`}>Correo</Text>
            <Text style={tw`text-white text-lg mb-4`}>{user?.Correo_Cli || ''}</Text>
        
            <TouchableOpacity
              style={tw`bg-teal-400 px-6 py-2 rounded-full`}
              onPress={() => setIsEditing(true)}
            >
              <Text style={tw`text-white font-semibold text-center`}>Editar</Text>
            </TouchableOpacity>
          </>
          )}
          </View>
        </View>

        {/* Lista de opciones */}
        <View style={tw`px-4 py-6`}>
          {menuItems.map((item, index) => (
           <TouchableOpacity
           key={index}
           style={tw`flex-row items-center justify-between p-4 mb-3 rounded-xl`}
           onPress={() => {
             if (item.title === 'Cerrar Sesión') {
               cerrarSesion();
             } else {

               console.log('Tocaste:', item.title);
             }
           }}
         >
           <View style={tw`flex-row items-center`}>
             <Ionicons name={item.icon} size={24} />
             <Text style={tw`ml-3 text-lg`}>
               {item.title}
             </Text>
           </View>
           
           {item.hasToggle ? (
             <View style={tw`flex-row items-center`}>
               <Ionicons name="sunny-outline" size={20} color="#6b7280" />
               <View style={tw`w-12 h-6 bg-gray-300 rounded-full ml-2 relative`}>
                 <View style={tw`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm`} />
               </View>
             </View>
           ) : (
             <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
           )}
         </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar 
                  />
    </SafeAreaView>
  );
};

export default ConfiguracionesScreen;