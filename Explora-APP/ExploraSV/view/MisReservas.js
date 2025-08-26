import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from './tw';
import { obtenerMisReservas } from './../api/reservas';

export default function MisReservas({ navigation }) {
  // ✅ SOLUCIÓN: Inicializar como array vacío
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await obtenerMisReservas();
      console.log('📦 Respuesta API misReservas:', response);
      
      // ✅ IMPORTANTE: Verificar la estructura de la respuesta
      if (response && response.success && Array.isArray(response.reservas)) {
        setReservas(response.reservas);
        console.log('✅ Reservas cargadas:', response.reservas.length);
      } else if (response && Array.isArray(response)) {
        // Si la API devuelve directamente un array
        setReservas(response);
      } else {
        console.warn('⚠️ Formato de respuesta inesperado:', response);
        setReservas([]); // Mantener como array vacío
        setError('No se pudieron cargar las reservas');
      }
    } catch (err) {
      console.error('❌ Error cargando reservas:', err);
      setError(err.message || 'Error al cargar reservas');
      setReservas([]); // ✅ Mantener como array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarReservas();
    setRefreshing(false);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha; // Devolver fecha original si no se puede formatear
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
      case 'confirmado':
        return colors.secondary;
      case 'pendiente':
        return colors.complementary;
      case 'cancelada':
      case 'cancelado':
        return colors.vibrant;
      default:
        return colors.neutralDark;
    }
  };

  const renderReservaItem = ({ item }) => {
    // ✅ Usar tanto formato nuevo como legacy para compatibilidad
    const reservaId = item.id || item.Id_Rese;
    const fechaReserva = item.fecha_reserva || item.Fec_Rese;
    const estado = item.estado || item.Est_Rese;
    const cantidadPersonas = item.cantidad_personas || item.Canti_Person;
    const subtotal = item.subtotal || item.SubT_Reservas;
    const lugar = item.lugar;
    const tipoLugar = item.tipo_lugar;

    return (
      <TouchableOpacity
        style={tw`bg-white rounded-2xl p-5 mb-4 mx-4 shadow-lg border border-gray-100`}
        onPress={() => navigation.navigate('DetalleReserva', { reserva: item })}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row justify-between items-start mb-3`}>
          <View style={tw`flex-1`}>
            <Text style={[tw`text-xl font-bold mb-1`, { color: colors.primary }]}>
              Reserva #{reservaId}
            </Text>
            <View style={tw`flex-row items-center mb-2`}>
              <View 
                style={[
                  tw`px-3 py-1 rounded-full`,
                  { backgroundColor: getEstadoColor(estado) + '20' }
                ]}
              >
                <Text 
                  style={[
                    tw`text-sm font-semibold capitalize`,
                    { color: getEstadoColor(estado) }
                  ]}
                >
                  {estado || 'Sin estado'}
                </Text>
              </View>
            </View>
          </View>
          
          {lugar?.imagen && (
            <Image
              source={{ uri: lugar.imagen }}
              style={tw`w-16 h-16 rounded-xl`}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={tw`space-y-2`}>
          {lugar && (
            <View style={tw`flex-row items-center`}>
              <Ionicons 
                name={tipoLugar === 'hotel' ? 'bed' : tipoLugar === 'restaurante' ? 'restaurant' : 'location'} 
                size={16} 
                color={colors.secondary} 
              />
              <Text style={[tw`ml-2 font-medium flex-1`, { color: colors.neutralDark }]}>
                {lugar.nombre || 'Lugar no especificado'}
              </Text>
            </View>
          )}

          <View style={tw`flex-row items-center`}>
            <Ionicons name="calendar" size={16} color={colors.secondary} />
            <Text style={[tw`ml-2`, { color: colors.neutralDark }]}>
              {formatearFecha(fechaReserva)}
            </Text>
          </View>

          <View style={tw`flex-row items-center justify-between mt-3`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="people" size={16} color={colors.complementary} />
              <Text style={[tw`ml-2 font-medium`, { color: colors.neutralDark }]}>
                {cantidadPersonas || 0} {(cantidadPersonas || 0) === 1 ? 'persona' : 'personas'}
              </Text>
            </View>

            {subtotal && (
              <Text style={[tw`text-lg font-bold`, { color: colors.complementary }]}>
                ${parseFloat(subtotal).toFixed(2)}
              </Text>
            )}
          </View>
        </View>

        <View style={tw`flex-row justify-end mt-3`}>
          <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  // ✅ Mostrar loading
  if (loading) {
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={tw`px-6 py-4 rounded-b-3xl`}
        >
          <Text style={tw`text-white text-2xl font-bold text-center`}>
            Mis Reservas
          </Text>
        </LinearGradient>
        
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={[tw`mt-4 text-lg`, { color: colors.neutralDark }]}>
            Cargando reservas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Mostrar error
  if (error) {
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={tw`px-6 py-4 rounded-b-3xl`}
        >
          <Text style={tw`text-white text-2xl font-bold text-center`}>
            Mis Reservas
          </Text>
        </LinearGradient>
        
        <View style={tw`flex-1 justify-center items-center px-6`}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.vibrant} />
          <Text style={[tw`text-xl font-bold mt-4 text-center`, { color: colors.neutralDark }]}>
            Error al cargar reservas
          </Text>
          <Text style={[tw`text-base mt-2 text-center`, { color: colors.neutralDark }]}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={cargarReservas}
            style={[tw`mt-6 px-6 py-3 rounded-xl`, { backgroundColor: colors.secondary }]}
          >
            <Text style={tw`text-white font-semibold text-lg`}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Verificación adicional antes de renderizar (por si acaso)
  if (!Array.isArray(reservas)) {
    console.warn('⚠️ reservas no es un array:', reservas);
    return (
      <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={[tw`text-lg`, { color: colors.neutralDark }]}>
            Error en el formato de datos
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={tw`px-6 py-4 rounded-b-3xl mb-4`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`bg-white/20 p-3 rounded-xl`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={tw`text-white text-2xl font-bold flex-1 text-center mx-4`}>
            Mis Reservas
          </Text>
          
          <TouchableOpacity
            onPress={cargarReservas}
            style={tw`bg-white/20 p-3 rounded-xl`}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Lista de reservas */}
      {reservas.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center px-6`}>
          <Ionicons name="calendar-outline" size={64} color={colors.secondary} />
          <Text style={[tw`text-xl font-bold mt-4 text-center`, { color: colors.neutralDark }]}>
            No tienes reservas
          </Text>
          <Text style={[tw`text-base mt-2 text-center`, { color: colors.neutralDark }]}>
            Cuando hagas una reserva, aparecerá aquí
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={[tw`mt-6 px-6 py-3 rounded-xl`, { backgroundColor: colors.secondary }]}
          >
            <Text style={tw`text-white font-semibold text-lg`}>Explorar lugares</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => (item.id || item.Id_Rese)?.toString() || Math.random().toString()}
          renderItem={renderReservaItem}
          contentContainerStyle={tw`pb-6`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.secondary]}
              tintColor={colors.secondary}
            />
          }
          // ✅ Props de optimización
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 180, // Altura aproximada de cada item
            offset: 180 * index,
            index,
          })}
        />
      )}
    </SafeAreaView>
  );
}
