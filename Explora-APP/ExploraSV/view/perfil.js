import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from './tw';
import { updateProfile, getCurrentUser } from '../auth';
import BottomNavBar from './components/nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';

const ConfiguracionesScreen = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation(); // <-- Hook de i18n

  // Paleta de colores
  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  const menuItems = [
    { title: t('Mis Reservas'), icon: 'calendar-outline', screen: 'MisReservas', color: colors.complementary },
    { title: t('Ayuda y soporte'), icon: 'help-circle-outline', screen: 'HelpSupport', color: colors.secondary },
    { title: t('Configuraciones'), icon: 'build-outline', screen: 'Configuraciones', color: colors.neutralDark },
    { title: t('Cerrar Sesión'), icon: 'exit-outline', isLogout: true, color: colors.vibrant },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        Alert.alert(t('Error'), t('No se pudo cargar la información del usuario'));
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
      await AsyncStorage.setItem('Turista', JSON.stringify(updatedUser));
      setIsEditing(false);
      Alert.alert(t('Éxito'), t('Perfil actualizado correctamente'));
    } catch (error) {
      Alert.alert(t('Error'), t('No se pudo actualizar el perfil'));
    }
  };

  const cerrarSesion = async () => {
    Alert.alert(
      t('Cerrar Sesión'),
      t('¿Estás seguro de que quieres cerrar sesión?'),
      [
        { text: t('Cancelar'), style: 'cancel' },
        {
          text: t('Cerrar Sesión'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              await AsyncStorage.removeItem('Turista');
              navigation.replace('Login');
            } catch (error) {
              Alert.alert(t('Error'), t('No fue posible cerrar sesión. Por favor, intenta de nuevo.'));
            }
          },
        },
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.isLogout) {
      cerrarSesion();
    } else if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      console.log('Tocaste:', item.title);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1 pb-20`, { backgroundColor: colors.neutralLight }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />     
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header con perfil */}
        <View style={[tw`px-6 pt-4 pb-8 rounded-b-3xl`, { backgroundColor: colors.primary, minHeight: 320 }]}>
          <View style={tw`flex-row items-center justify-between mb-8 pt-12`}>
            <Text style={tw`text-2xl font-bold text-white`}>{t('Mi Perfil')}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={tw`items-center`}>
            <View style={tw`relative mb-4`}>
              <View 
                style={[tw`w-28 h-28 rounded-full overflow-hidden`, { 
                  borderWidth: 4, 
                  borderColor: colors.complementary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }]}
              >
                <Image
                  source={user?.avatar ? { uri: user.avatar } : require('../assets/Favicon25.png')}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              </View>
              <View style={[tw`absolute -bottom-1 -right-1 w-8 h-8 rounded-full items-center justify-center`, { backgroundColor: colors.complementary }]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>

            {isEditing ? (
              <View style={tw`w-full max-w-xs`}>
                <View style={tw`mb-4`}>
                  <Text style={tw`text-white text-sm font-medium mb-2 opacity-90`}>{t('Nombre completo')}</Text>
                  <TextInput
                    style={[tw`bg-white rounded-xl px-4 py-3 text-base`, { color: colors.neutralDark }]}
                    value={user?.Nom_Cli || ''}
                    onChangeText={(text) => setUser({ ...user, Nom_Cli: text })}
                    placeholder={t('Ingresa tu nombre')}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={tw`mb-6`}>
                  <Text style={tw`text-white text-sm font-medium mb-2 opacity-90`}>{t('Correo electrónico')}</Text>
                  <TextInput
                    style={[tw`bg-white rounded-xl px-4 py-3 text-base`, { color: colors.neutralDark }]}
                    value={user?.Correo_Cli || ''}
                    onChangeText={(text) => setUser({ ...user, Correo_Cli: text })}
                    placeholder={t('correo@ejemplo.com')}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={tw`flex-row justify-between`}>
                  <TouchableOpacity
                    style={[tw`flex-1 py-3 rounded-xl mr-2 flex-row items-center justify-center`, { backgroundColor: colors.neutralDark + '20' }]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Ionicons name="close" size={18} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white font-semibold`}>{t('Cancelar')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[tw`flex-1 py-3 rounded-xl ml-2 flex-row items-center justify-center`, { backgroundColor: colors.complementary }]}
                    onPress={handleSave}
                  >
                    <Ionicons name="checkmark" size={18} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white font-semibold`}>{t('Guardar')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={tw`items-center w-full`}>
                <Text style={tw`text-white text-2xl font-bold mb-1`}>{user?.Nom_Cli || t('Turista')}</Text>
                <Text style={tw`text-white opacity-80 text-base mb-6`}>{user?.Correo_Cli}</Text>

                <TouchableOpacity
                  style={[tw`px-8 py-3 rounded-xl flex-row items-center`, { backgroundColor: colors.complementary }]}
                  onPress={() => {
                    if (!user) navigation.navigate('SignUp');
                    else setIsEditing(true);
                  }}
                >
                  <Ionicons name={user ? "create-outline" : "person-add-outline"} size={20} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-white font-bold text-base`}>{user ? t('Editar Perfil') : t('Registrarse')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Lista de opciones */}
        <View style={tw`px-6 pb-6`}>
          <Text style={[tw`text-lg font-bold mb-4 mt-5`, { color: colors.primary }]}>{t('Configuraciones generales')}</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[tw`flex-row items-center justify-between p-4 mb-3 rounded-2xl bg-white`, {
                shadowColor: colors.neutralDark,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={tw`flex-row items-center flex-1`}>
                <View style={[tw`w-12 h-12 rounded-xl items-center justify-center mr-4`, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-sm font-semibold`, { color: colors.neutralDark }]}>{item.title}</Text>
                  {item.subtitle && <Text style={[tw`text-sm mt-1`, { color: colors.neutralDark + '80' }]}>{item.subtitle}</Text>}
                </View>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color={colors.neutralDark + '60'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default ConfiguracionesScreen;
