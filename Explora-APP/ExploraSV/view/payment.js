import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import api from '../api';

const COLORS = {
  primary: '#101C5D',
  secondary: '#569298',
  gold: '#D4AF37',
  light: '#F5F5F5',
  dark: '#333333',
  coral: '#F97C7C',
  goldHover: '#c89e2f',
  coralHover: '#e96363',
  cardShadow: '#3333331A'
};

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reservaData } = route.params || {};

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('tarjeta');
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();

  if (!reservaData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-[${COLORS.light}] justify-center items-center`}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.coral} />
        <Text style={tw`text-[${COLORS.coral}] text-lg mt-4 text-center px-6`}>
          Error: No hay datos de reserva disponibles
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`mt-6 bg-[${COLORS.secondary}] px-6 py-3 rounded-lg`}
        >
          <Text style={tw`text-white font-semibold`}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const paymentMethods = [
    { id: 'tarjeta', name: 'Tarjeta', icon: '💳' },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'tarjeta') {
      if (!cardDetails.complete) {
        Alert.alert('Error', 'Completa los datos de tu tarjeta');
        return;
      }
      setLoading(true);
      try {
        const amountInCents = Math.round(reservaData.total * 100);
        const response = await api.post('/create-payment-intent', {
          amount: amountInCents,
          currency: 'usd',
          reserva_id: reservaData.id,
          description: `Reserva ${reservaData.lugar.tipo} - ${reservaData.lugar.nombre}`
        });
        const { clientSecret } = response.data;
        const { paymentIntent, error } = await confirmPayment(clientSecret, { paymentMethodType: 'Card' });
        if (error) {
          Alert.alert('Error de pago', error.message);
        } else if (paymentIntent) {
          Alert.alert(
            '¡Pago exitoso!', 
            `Tu pago de $${reservaData.total.toFixed(2)} se procesó correctamente.\n\nID de transacción: ${paymentIntent.id}`,
            [{ text: 'Continuar', onPress: () => navigation.navigate('MisReservas') }]
          );
        }
      } catch (err) {
        console.error('Error procesando pago:', err);
        Alert.alert('Error', 'No se pudo procesar el pago. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else if (selectedPaymentMethod === 'puntos') {
      Alert.alert(
        'Pago con puntos',
        'Esta funcionalidad estará disponible próximamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${COLORS.light}]`}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Navbar */}
      <View style={tw`flex-row items-center px-5 py-4 bg-[${COLORS.primary}]`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg font-extrabold flex-1 text-center`}>
          Proceso de Pago
        </Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView style={tw`flex-1 px-4 py-6`} showsVerticalScrollIndicator={false}>
        {/* Tarjeta Resumen Reserva */}
        <View style={[
          tw`p-5 rounded-2xl mb-6`,
          { backgroundColor: "#fff", shadowColor: COLORS.cardShadow, shadowRadius: 8, shadowOffset: { height: 4 }, shadowOpacity: 1, borderColor: COLORS.secondary + "30", borderWidth: 1 }
        ]}>
          <Text style={tw`text-xl font-extrabold mb-4 text-[${COLORS.primary}]`}>
            <Ionicons name="receipt-outline" size={22} color={COLORS.primary} /> Resumen de la reserva
          </Text>
          <View style={tw`space-y-2 mb-3`}>
            <Text style={tw`text-[${COLORS.dark}]`}><Text style={tw`font-bold`}>Lugar: </Text>{reservaData.lugar.nombre}</Text>
            <Text style={tw`text-[${COLORS.dark}]`}><Text style={tw`font-bold`}>Tipo: </Text>
              <Text style={tw`capitalize`}>{reservaData.lugar.tipo}</Text>
            </Text>
            <Text style={tw`text-[${COLORS.dark}]`}><Text style={tw`font-bold`}>Personas: </Text>{reservaData.personas}</Text>
            <Text style={tw`text-[${COLORS.dark}]`}>
              <Text style={tw`font-bold`}>Fechas: </Text>
              <Text>{reservaData.fechas.inicio} - {reservaData.fechas.fin}</Text>
            </Text>
            {reservaData.habitacion && (
              <Text style={tw`text-[${COLORS.dark}]`}><Text style={tw`font-bold`}>Habitación: </Text>{reservaData.habitacion.numero} ({reservaData.habitacion.tipo})</Text>
            )}
            {reservaData.noches > 0 && (
              <Text style={tw`text-[${COLORS.dark}]`}><Text style={tw`font-bold`}>Noches: </Text>
                {reservaData.noches} {reservaData.noches === 1 ? 'noche' : 'noches'}
              </Text>
            )}
          </View>
          <View style={tw`border-t border-[${COLORS.light}] pt-4`}>
            <View style={tw`flex-row justify-between mb-1`}>
              <Text style={tw`text-[${COLORS.dark}]`}>Subtotal:</Text>
              <Text style={tw`font-bold text-[${COLORS.primary}]`}>${reservaData.subTotal.toFixed(2)}</Text>
            </View>
            <View style={tw`flex-row justify-between mb-1`}>
              <Text style={tw`text-[${COLORS.dark}]`}>Costo servicio:</Text>
              <Text style={tw`font-bold text-[${COLORS.primary}]`}>${reservaData.costoServicio.toFixed(2)}</Text>
            </View>
            <View style={tw`flex-row justify-between border-t border-[${COLORS.light}] pt-3`}>
              <Text style={tw`text-xl font-bold text-[${COLORS.primary}]`}>Total:</Text>
              <Text style={tw`text-2xl font-extrabold text-[${COLORS.gold}]`}>${reservaData.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Métodos de pago */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-lg font-bold mb-4 text-[${COLORS.primary}]`}>
            <Ionicons name="card-outline" size={22} color={COLORS.primary} /> Método de pago
          </Text>
          <View style={tw`space-y-3`}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => handlePaymentMethodSelect(method.id)}
                style={[
                  tw`flex-row items-center justify-between p-4 rounded-2xl border-2`,
                  {
                    borderColor: selectedPaymentMethod === method.id
                      ? COLORS.gold
                      : COLORS.secondary + "30",
                    backgroundColor: selectedPaymentMethod === method.id
                      ? COLORS.gold + "19"
                      : "#fff"
                  }
                ]}
                activeOpacity={0.8}
              >
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-2xl mr-4`}>{method.icon}</Text>
                  <Text style={tw`text-[${COLORS.dark}] font-semibold text-lg`}>
                    {method.name}
                  </Text>
                </View>
                {selectedPaymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tarjeta Stripe */}
        {selectedPaymentMethod === 'tarjeta' && (
          <View style={tw`bg-[${COLORS.primary}] rounded-2xl p-6 mb-6`}>
            <Text style={tw`text-white text-lg font-bold mb-4`}>
              Datos de la tarjeta
            </Text>
            <CardField
              postalCodeEnabled={false}
              placeholder={{ 
                number: '4242 4242 4242 4242',
                expiry: 'MM/YY',
                cvc: 'CVC'
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF', 
                textColor: COLORS.dark,
                borderRadius: 8
              }}
              style={{ height: 50, marginVertical: 10 }}
              onCardChange={(card) => setCardDetails(card)}
            />
            <Text style={tw`text-white/70 text-xs mt-2`}>
              💡 Usa 4242 4242 4242 4242 para pruebas
            </Text>
          </View>
        )}

        {/* Botón de pago */}
        <TouchableOpacity
          onPress={handlePayment}
          disabled={loading || (selectedPaymentMethod === 'tarjeta' && !cardDetails.complete)}
          style={[
            tw`rounded-2xl py-4 px-6 items-center mb-8 flex-row justify-center`,
            {
              backgroundColor: COLORS.gold,
              opacity: loading || (selectedPaymentMethod === 'tarjeta' && !cardDetails.complete) ? 0.5 : 1,
              shadowColor: COLORS.gold,
              shadowRadius: 8,
              shadowOpacity: 0.2,
              shadowOffset: { height: 3 }
            }
          ]}
          activeOpacity={0.82}
        >
          {loading ? (
            <View style={tw`flex-row items-center`}>
              <ActivityIndicator color="white" size="small" />
              <Text style={tw`text-white text-lg font-bold ml-3`}>
                Procesando...
              </Text>
            </View>
          ) : (
            <>
              <Ionicons name="card" size={24} color="white" style={tw`mr-3`} />
              <Text style={tw`text-white text-lg font-bold`}>
                Pagar ${reservaData.total.toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;
