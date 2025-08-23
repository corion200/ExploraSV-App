import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from './tw';
import BottomNavBar from './components/nav';
import api from '../api';

export default function MisReservas({ navigation }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  const obtenerReservas = async () => {
    try {
      const response = await api.get('/mis-reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    obtenerReservas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    obtenerReservas();
  };

  const cancelarReserva = async (reservaId) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que quieres cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.patch(`/cancelar-reserva/${reservaId}`);
              Alert.alert('Éxito', 'Reserva cancelada correctamente');
              obtenerReservas(); // Recargar lista
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar la reserva');
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return colors.secondary;
      case 'pendiente':
        return colors.complementary;
      case 'cancelada':
        return colors.vibrant;
      default:
        return colors.neutralDark;
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'checkmark-circle';
      case 'pendiente':
        return 'time';
      case 'cancelada':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'hotel':
        return 'bed';
      case 'restaurante':
        return 'restaurant';
      case 'sitio_turistico':
        return 'location';
      default:
        return 'map';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.neutralLight }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[tw`mt-4 text-base`, { color: colors.neutralDark }]}>
          Cargando reservas...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      {/* Header */}
      <View style={[tw`px-6 py-4 flex-row items-center justify-between`, { backgroundColor: 'white' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={[tw`text-xl font-bold`, { color: colors.primary }]}>
          Mis Reservas
        </Text>
        
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 py-4 pb-24`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {reservas.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center mt-20`}>
            <Ionicons name="calendar-outline" size={80} color={colors.neutralDark} />
            <Text style={[tw`text-lg font-bold mt-4 mb-2`, { color: colors.neutralDark }]}>
              No tienes reservas
            </Text>
            <Text style={[tw`text-center text-base mb-8`, { color: colors.neutralDark }]}>
              ¡Explora lugares increíbles y haz tu primera reserva!
            </Text>
            
            <TouchableOpacity
              style={[tw`px-8 py-3 rounded-xl flex-row items-center`, { backgroundColor: colors.complementary }]}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={20} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-bold text-base`}>
                Buscar Lugares
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          reservas.map((reserva, index) => (
            <View
              key={reserva.id || index}
              style={[
                tw`bg-white rounded-2xl p-4 mb-4 shadow-sm`,
                { borderLeftWidth: 4, borderLeftColor: getEstadoColor(reserva.Est_Rese) }
              ]}
            >
              {/* Header de la reserva */}
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-lg font-bold mb-1`, { color: colors.primary }]}>
                    {reserva.nombre_lugar || `Reserva #${reserva.id}`}
                  </Text>
                  
                  <View style={tw`flex-row items-center`}>
                    <Ionicons
                      name={getTipoIcon(reserva.tipo_lugar)}
                      size={16}
                      color={colors.complementary}
                      style={tw`mr-2`}
                    />
                    <Text style={[tw`text-sm`, { color: colors.neutralDark }]}>
                      {reserva.tipo_lugar === 'hotel' ? 'Hotel' : 
                       reserva.tipo_lugar === 'restaurante' ? 'Restaurante' : 'Sitio Turístico'}
                    </Text>
                  </View>
                </View>

                <View style={tw`items-end`}>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Ionicons
                      name={getEstadoIcon(reserva.Est_Rese)}
                      size={16}
                      color={getEstadoColor(reserva.Est_Rese)}
                      style={tw`mr-1`}
                    />
                    <Text style={[tw`text-sm font-bold`, { color: getEstadoColor(reserva.Est_Rese) }]}>
                      {reserva.Est_Rese || 'Pendiente'}
                    </Text>
                  </View>
                  <Text style={[tw`text-xs`, { color: colors.neutralDark }]}>
                    ID: {reserva.id}
                  </Text>
                </View>
              </View>

              {/* Detalles de la reserva */}
              <View style={tw`bg-gray-50 rounded-xl p-3 mb-3`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <View style={tw`flex-1`}>
                    <Text style={[tw`text-xs font-medium`, { color: colors.neutralDark }]}>
                      Fecha de reserva
                    </Text>
                    <Text style={[tw`text-sm font-bold`, { color: colors.primary }]}>
                      {formatearFecha(reserva.Fec_Rese)}
                    </Text>
                  </View>
                  
                  <View style={tw`flex-1 items-end`}>
                    <Text style={[tw`text-xs font-medium`, { color: colors.neutralDark }]}>
                      Personas
                    </Text>
                    <Text style={[tw`text-sm font-bold`, { color: colors.primary }]}>
                      {reserva.cantidad_personas || 'N/A'}
                    </Text>
                  </View>
                </View>

                {reserva.fecha_inicio && (
                  <View style={tw`flex-row justify-between`}>
                    <View style={tw`flex-1`}>
                      <Text style={[tw`text-xs font-medium`, { color: colors.neutralDark }]}>
                        Inicio
                      </Text>
                      <Text style={[tw`text-sm`, { color: colors.neutralDark }]}>
                        {formatearFecha(reserva.fecha_inicio)}
                      </Text>
                    </View>
                    
                    {reserva.fecha_fin && (
                      <View style={tw`flex-1 items-end`}>
                        <Text style={[tw`text-xs font-medium`, { color: colors.neutralDark }]}>
                          Fin
                        </Text>
                        <Text style={[tw`text-sm`, { color: colors.neutralDark }]}>
                          {formatearFecha(reserva.fecha_fin)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Botones de acción */}
              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  style={[tw`flex-1 py-2 px-4 rounded-lg mr-2 flex-row items-center justify-center`, { backgroundColor: colors.secondary }]}
                  onPress={() => {
                    // Navegar a detalle de la reserva o al lugar
                    navigation.navigate('DetalleReserva', { reserva });
                  }}
                >
                  <Ionicons name="eye" size={16} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-white font-medium text-sm`}>Ver Detalle</Text>
                </TouchableOpacity>

                {reserva.Est_Rese !== 'cancelada' && (
                  <TouchableOpacity
                    style={[tw`flex-1 py-2 px-4 rounded-lg ml-2 flex-row items-center justify-center`, { backgroundColor: colors.vibrant }]}
                    onPress={() => cancelarReserva(reserva.id)}
                  >
                    <Ionicons name="close" size={16} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white font-medium text-sm`}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}
