import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import tw from 'twrnc';


const PaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tarjeta');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');



  const paymentMethods = [
    {
      id: 'puntos',
      name: 'Puntos Explora',
      icon: '🏆',
      selected: selectedPaymentMethod === 'Puntos Explora'
    },
    {
      id: 'tarjeta',
      name: 'Tarjeta',
      icon: '💳',
      selected: selectedPaymentMethod === 'Tarjeta'
    },
    
  ];


  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };


  const handlePayment = () => {
    console.log('Procesando pago...');
    // Aquí iría la lógica de procesamiento de pago
  };


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-100`}>
        <TouchableOpacity style={tw`mr-4`}>
          <Text style={tw`text-2xl`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold flex-1 text-center`}>
          Proceso de Pago
        </Text>
      </View>


      {/* Progress Indicator */}
      <View style={tw`px-4 py-6`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-4 h-4 rounded-full bg-teal-400`} />
          <View style={tw`flex-1 h-0.5 bg-teal-400 mx-2`} />
          <View style={tw`w-4 h-4 rounded-full bg-gray-200`} />
        </View>
      </View>


      <ScrollView style={tw`flex-1 px-4`}>
        {/* Payment Methods */}
        <View style={tw`space-y-3 mb-6`}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handlePaymentMethodSelect(method.name)}
              style={tw`flex-row items-center justify-between p-4 border border-gray-200 rounded-lg ${
                method.selected ? 'border-teal-400 bg-teal-50' : 'bg-white'
              }`}
            >
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-2xl mr-3`}>{method.icon}</Text>
                <Text style={tw`text-gray-700 font-medium`}>{method.name}</Text>
              </View>
              <View style={tw`w-6 h-6 rounded-full border-2 ${
                method.selected ? 'border-teal-400 bg-teal-400' : 'border-gray-300'
              } items-center justify-center`}>
                {method.selected && (
                  <View style={tw`w-3 h-3 rounded-full bg-white`} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>


        {/* Solo cuando este seleccionada */}
        {selectedPaymentMethod === 'Tarjeta' && (
          <View style={tw`bg-[#101C5D] rounded-lg p-6 mb-6`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-white text-sm font-medium mb-2`}>
                Nombre del Titular
              </Text>
              <TextInput
                style={tw`bg-white rounded-lg px-3 py-3 text-gray-800`}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="Ingrese el nombre"
                placeholderTextColor="#9CA3AF"
              />
            </View>



            <View style={tw`mb-4`}>
              <Text style={tw`text-white text-sm font-medium mb-2`}>
                Número de Tarjeta
              </Text>
              <TextInput
                style={tw`bg-white rounded-lg px-3 py-3 text-gray-800`}
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>



            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-white text-sm font-medium mb-2`}>
                  Mes de vencimiento
                </Text>
                <TextInput
                  style={tw`bg-white rounded-lg px-3 py-3 text-gray-800`}
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  placeholder="MM"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-white text-sm font-medium mb-2`}>
                  Año de vencimiento
                </Text>
                <TextInput
                  style={tw`bg-white rounded-lg px-3 py-3 text-gray-800`}
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  placeholder="AAAA"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>


            {/* CVV */}
            <View>
              <Text style={tw`text-white text-sm font-medium mb-2`}>CVV</Text>
              <TextInput
                style={tw`bg-white rounded-lg px-3 py-3 text-gray-800 w-24`}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        )}
        
      <View style={tw` pb-6 mb-10`}>
        <TouchableOpacity
          onPress={handlePayment}
          style={tw`bg-black rounded-lg py-3 px-6 items-center mb-40`}
        >
          <Text style={tw`text-white text-ms font-semibold`}>Pagar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

    </SafeAreaView>
  );
};


export default PaymentScreen;
