import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cancelarReserva } from '../../api/reservas';
import tw from '../tw';
import BottomNavBar from './nav';

export default function DetalleReserva({ route, navigation }) {
  const { reserva } = route.params;
  
  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  // ✅ Compatibilidad con ambos formatos de datos
  const reservaId = reserva.id || reserva.Id_Rese;
  const fechaReserva = reserva.fecha_reserva || reserva.Fec_Rese;
  const estado = reserva.estado || reserva.Est_Rese;
  const cantidadPersonas = reserva.cantidad_personas || reserva.Canti_Person;
  const subtotal = reserva.subtotal || reserva.SubT_Reservas;
  const confirmada = reserva.confirmada || reserva.Confi_Rese;
  const lugar = reserva.lugar;
  const tipoLugar = reserva.tipo_lugar;

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
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

  const handleCancelar = async () => {
    if (estado?.toLowerCase() === 'cancelada') {
      Alert.alert('Reserva ya cancelada', 'Esta reserva ya fue cancelada anteriormente.');
      return;
    }

    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, Cancelar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelarReserva(reservaId);
              Alert.alert(
                'Reserva cancelada', 
                'Tu reserva ha sido cancelada exitosamente.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo cancelar la reserva');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={tw`px-6 py-4 rounded-b-3xl`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-white text-xl font-bold flex-1 text-center mx-4`}>
            Detalle de Reserva
          </Text>
          <View style={tw`w-12`} />
        </View>
      </LinearGradient>

      {/* ✅ CONTENIDO CON PADDING BOTTOM PARA EL NAV */}
      <ScrollView 
        style={tw`flex-1 px-6 py-4`} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-32`} // ✅ AGREGAR PADDING BOTTOM
      >
        {/* Información principal */}
        <View style={tw`bg-white rounded-3xl p-6 mb-6 shadow-lg`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View>
              <Text style={[tw`text-2xl font-bold mb-2`, { color: colors.primary }]}>
                Reserva #{reservaId}
              </Text>
              <View 
                style={[
                  tw`px-4 py-2 rounded-full self-start`,
                  { backgroundColor: getEstadoColor(estado) + '20' }
                ]}
              >
                <Text 
                  style={[
                    tw`font-bold capitalize`,
                    { color: getEstadoColor(estado) }
                  ]}
                >
                  {estado || 'Sin estado'}
                </Text>
              </View>
            </View>

            {lugar?.imagen && (
              <Image
                source={{ uri: lugar.imagen }}
                style={tw`w-20 h-20 rounded-2xl`}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={tw`space-y-4`}>
            <View>
              <Text style={[tw`text-sm font-medium mb-1`, { color: colors.secondary }]}>
                FECHA DE RESERVA
              </Text>
              <Text style={[tw`text-lg font-semibold`, { color: colors.neutralDark }]}>
                {formatearFecha(fechaReserva)}
              </Text>
            </View>

            <View>
              <Text style={[tw`text-sm font-medium mb-1`, { color: colors.secondary }]}>
                CANTIDAD DE PERSONAS
              </Text>
              <Text style={[tw`text-lg font-semibold`, { color: colors.neutralDark }]}>
                {cantidadPersonas || 0} {(cantidadPersonas || 0) === 1 ? 'persona' : 'personas'}
              </Text>
            </View>

            {subtotal && (
              <View>
                <Text style={[tw`text-sm font-medium mb-1`, { color: colors.secondary }]}>
                  SUBTOTAL
                </Text>
                <Text style={[tw`text-2xl font-bold`, { color: colors.complementary }]}>
                  ${parseFloat(subtotal).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Información del lugar */}
        {lugar && (
          <View style={tw`bg-white rounded-3xl p-6 mb-6 shadow-lg`}>
            <Text style={[tw`text-xl font-bold mb-4`, { color: colors.primary }]}>
              Información del {tipoLugar === 'hotel' ? 'Hotel' : tipoLugar === 'restaurante' ? 'Restaurante' : 'Lugar'}
            </Text>

            <View style={tw`space-y-3`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons 
                  name={tipoLugar === 'hotel' ? 'bed' : tipoLugar === 'restaurante' ? 'restaurant' : 'location'} 
                  size={20} 
                  color={colors.secondary} 
                />
                <Text style={[tw`ml-3 text-lg font-semibold flex-1`, { color: colors.neutralDark }]}>
                  {lugar.nombre || 'Nombre no disponible'}
                </Text>
              </View>

              {lugar.descripcion && (
                <Text style={[tw`text-base leading-6 mt-2`, { color: colors.neutralDark }]}>
                  {lugar.descripcion}
                </Text>
              )}

              {lugar.capacidad_maxima && (
                <View style={tw`flex-row items-center mt-3`}>
                  <Ionicons name="people" size={18} color={colors.complementary} />
                  <Text style={[tw`ml-3 text-base`, { color: colors.neutralDark }]}>
                    Capacidad máxima: {lugar.capacidad_maxima} personas
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Estados adicionales */}
        <View style={tw`bg-white rounded-3xl p-6 mb-6 shadow-lg`}>
          <Text style={[tw`text-xl font-bold mb-4`, { color: colors.primary }]}>
            Estado de la reserva
          </Text>

          <View style={tw`flex-row items-center justify-between`}>
            <View>
              <Text style={[tw`text-base`, { color: colors.neutralDark }]}>
                Confirmación: {confirmada ? 'Confirmada' : 'Pendiente'}
              </Text>
              <Text style={[tw`text-sm mt-1`, { color: colors.secondary }]}>
                {confirmada 
                  ? 'Tu reserva ha sido confirmada por el establecimiento' 
                  : 'Esperando confirmación del establecimiento'
                }
              </Text>
            </View>
            <Ionicons 
              name={confirmada ? 'checkmark-circle' : 'time'} 
              size={24} 
              color={confirmada ? colors.secondary : colors.complementary} 
            />
          </View>
        </View>

        {/* Botón de cancelar */}
        {estado?.toLowerCase() !== 'cancelada' && (
          <TouchableOpacity
            onPress={handleCancelar}
            style={[tw`p-4 rounded-2xl mb-8`, { backgroundColor: colors.vibrant + '15', borderColor: colors.vibrant, borderWidth: 1 }]}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <Ionicons name="close-circle" size={24} color={colors.vibrant} />
              <Text style={[tw`ml-3 text-lg font-semibold`, { color: colors.vibrant }]}>
                Cancelar Reserva
              </Text>
            </View>
          </TouchableOpacity>

        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}
