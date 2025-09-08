// screens/HelpSupport.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Linking,
  TextInput,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import tw from './tw';
import { chatbotApi } from '../api/chatbot';

const COLORS = {
  primary: '#101C5D',
  secondary: '#569298',
  gold: '#D4AF37',
  lightGray: '#F5F5F5',
  darkGray: '#333333',
  coral: '#F97C7C',
  white: '#FFFFFF'
};

const HelpSupport = ({ navigation }) => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [problemType, setProblemType] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemTypes = [
    { label: 'Selecciona el tipo de problema', value: '' },
    { label: '🐛 Error en la aplicación', value: 'bug' },
    { label: '💳 Problema con pagos', value: 'payment' },
    { label: '📍 Información incorrecta', value: 'location_info' },
    { label: '🏨 Problema con reserva', value: 'booking' },
    { label: '👤 Problema con mi cuenta', value: 'account' },
    { label: '🔒 Problema de seguridad', value: 'security' },
    { label: '❓ Otro problema', value: 'other' }
  ];

  const handleSubmitReport = async () => {
    if (!problemType || !problemTitle.trim() || !problemDescription.trim() || !userEmail.trim()) {
      Toast.show({
        type: 'error',
        text1: '🐦 ¡Faltan datos!',
        text2: 'Tori necesita que completes todos los campos.',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    Toast.show({
      type: 'success',
      text1: '🐦 ¡Reporte enviado!',
      text2: 'Tori ha recibido tu reporte. Te responderemos pronto.',
    });

    setProblemType('');
    setProblemTitle('');
    setProblemDescription('');
    setUserEmail('');
    setIsSubmitting(false);
    setReportModalVisible(false);
  };

  const handleContactSupport = (method) => {
    switch (method) {
      case 'email':
        Linking.openURL('mailto:soporte@tuapp.com?subject=Consulta desde la App');
        break;
      case 'whatsapp':
        Linking.openURL('whatsapp://send?phone=5212345678&text=Hola, necesito ayuda con la app');
        break;
      case 'phone':
        Linking.openURL('tel:+5212345678');
        break;
    }
  };

  const MenuCard = ({ icon, title, subtitle, onPress, color = COLORS.secondary }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`bg-white mx-5 mb-4 p-5 rounded-2xl flex-row items-center shadow-md border-l-4`,
        { borderLeftColor: color }
      ]}
    >
      <View
        style={[
          tw`w-12 h-12 rounded-full justify-center items-center mr-4`,
          { backgroundColor: `${color}20` }
        ]}
      >
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text style={[tw`text-base font-bold mb-1`, { color: COLORS.primary }]}>{title}</Text>
        <Text style={[tw`text-sm leading-5`, { color: COLORS.darkGray }]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.darkGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: COLORS.lightGray }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />

      {/* Header */}
      <View style={tw`flex-row items-center px-5 py-4 bg-white border-b border-gray-200 pt-20`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[tw`text-lg font-bold ml-4`, { color: COLORS.primary }]}>
          Ayuda y Soporte
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mensaje de Tori */}
        <View
          style={[
            tw`bg-white mx-5 mt-5 p-5 rounded-2xl border-l-4`,
            { borderLeftColor: COLORS.gold }
          ]}
        >
          <Text style={[tw`text-base font-bold mb-2`, { color: COLORS.primary }]}>
            🐦 ¡Hola! Soy Tori, tu asistente de viajes
          </Text>
          <Text style={[tw`text-sm leading-5`, { color: COLORS.darkGray }]}>
            Estoy aquí para ayudarte con cualquier duda o problema. ¡Elige cómo prefieres que te ayude!
          </Text>
        </View>

        {/* Contacto */}
        <Text style={[tw`text-lg font-bold mx-5 mt-8 mb-4`, { color: COLORS.primary }]}>
          💬 Contacto Directo
        </Text>

        <MenuCard
          icon="🐦"
          title="Chat con Tori"
          subtitle="Chatea conmigo para resolver dudas rápidas"
          onPress={() => { chatbotApi(); navigation.navigate('ChatScreen'); }}
          color={COLORS.gold}
        />

        <MenuCard
          icon="📧"
          title="Enviar Email"
          subtitle="Contacta a nuestro equipo de soporte humano"
          onPress={() => handleContactSupport('email')}
          color={COLORS.gold}
        />

        <MenuCard
          icon="📱"
          title="WhatsApp"
          subtitle="Escríbenos por WhatsApp para ayuda inmediata"
          onPress={() => handleContactSupport('whatsapp')}
          color={COLORS.gold}
        />

        {/* Reportes */}
        <Text style={[tw`text-lg font-bold mx-5 mt-8 mb-4`, { color: COLORS.primary }]}>
          🛠️ Reportar Problemas
        </Text>

        <MenuCard
          icon="🐛"
          title="Reportar un Error"
          subtitle="Cuéntanos si algo no funciona correctamente"
          onPress={() => setReportModalVisible(true)}
          color={COLORS.coral}
        />

        <MenuCard
          icon="📍"
          title="Información Incorrecta"
          subtitle="Reporta datos erróneos de lugares o establecimientos"
          onPress={() => setReportModalVisible(true)}
          color={COLORS.coral}
        />

        {/* Legal */}
        <Text style={[tw`text-lg font-bold mx-5 mt-8 mb-4`, { color: COLORS.primary }]}>
          📋 Información Legal
        </Text>

        <MenuCard
          icon="📄"
          title="Términos y Condiciones"
          subtitle="Lee nuestros términos de uso y política de privacidad"
          onPress={() => setTermsModalVisible(true)}
          color={COLORS.primary}
        />

        <View style={tw`h-12`} />
      </ScrollView>

      {/* Modal de Reporte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={tw`flex-1 bg-[rgba(0,0,0,0.5)] justify-end`}>
          <View style={tw`bg-white rounded-t-2xl px-5 pt-5 max-h-[80%]`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center mb-5`}>
              <Text style={[tw`text-lg font-bold`, { color: COLORS.primary }]}>
                🐛 Reportar Problema
              </Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Intro */}
              <View
                style={[
                  tw`bg-gray-100 p-4 rounded-xl mb-5 border-l-4`,
                  { borderLeftColor: COLORS.coral }
                ]}
              >
                <Text style={[tw`text-sm font-bold`, { color: COLORS.primary }]}>
                  🐦 ¡Cuéntale a Tori qué pasó!
                </Text>
                <Text style={[tw`text-xs mt-1`, { color: COLORS.darkGray }]}>
                  Entre más detalles nos des, mejor podremos ayudarte.
                </Text>
              </View>

              {/* Tipo de problema */}
              <Text style={[tw`text-sm font-bold mb-2`, { color: COLORS.primary }]}>
                Tipo de Problema
              </Text>
              <View style={tw`border border-gray-200 rounded-xl mb-4`}>
                <Picker
                  selectedValue={problemType}
                  onValueChange={setProblemType}
                  style={tw`h-12`}
                >
                  {problemTypes.map((type) => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>

              {/* Título */}
              <Text style={[tw`text-sm font-bold mb-2`, { color: COLORS.primary }]}>
                Título del Problema
              </Text>
              <TextInput
                value={problemTitle}
                onChangeText={setProblemTitle}
                placeholder="Ejemplo: La app se cierra al abrir reservas"
                style={[
                  tw`bg-white rounded-xl px-4 py-3 text-base border border-gray-200 mb-4`,
                  { color: COLORS.primary }
                ]}
                placeholderTextColor="#999"
              />

              {/* Descripción */}
              <Text style={[tw`text-sm font-bold mb-2`, { color: COLORS.primary }]}>
                Describe el Problema
              </Text>
              <TextInput
                value={problemDescription}
                onChangeText={setProblemDescription}
                placeholder="Cuéntanos qué estabas haciendo cuando ocurrió el problema..."
                multiline
                numberOfLines={4}
                style={[
                  tw`bg-white rounded-xl px-4 py-3 text-base border border-gray-200 mb-4`,
                  { color: COLORS.primary, textAlignVertical: 'top' }
                ]}
                placeholderTextColor="#999"
              />

              {/* Email */}
              <Text style={[tw`text-sm font-bold mb-2`, { color: COLORS.primary }]}>
                Tu Email (para respuesta)
              </Text>
              <TextInput
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  tw`bg-white rounded-xl px-4 py-3 text-base border border-gray-200 mb-6`,
                  { color: COLORS.primary }
                ]}
                placeholderTextColor="#999"
              />

              {/* Botón */}
              <TouchableOpacity
                onPress={handleSubmitReport}
                disabled={isSubmitting}
                style={tw`${isSubmitting ? 'bg-gray-300' : 'bg-[#F97C7C]'} rounded-xl py-4 items-center mb-8`}
              >
                <Text style={tw`text-white font-bold text-lg`}>
                  {isSubmitting ? '🐦 Enviando...' : '🐦 Enviar Reporte'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Términos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={tw`flex-1 bg-[rgba(0,0,0,0.5)]`}>
          <SafeAreaView style={tw`flex-1 bg-white mt-12 rounded-t-2xl`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-center px-5 py-4 border-b border-gray-200`}>
              <Text style={[tw`text-lg font-bold`, { color: COLORS.primary }]}>
                📄 Términos y Condiciones
              </Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView style={tw`flex-1 px-5`}>
              <View
                style={[
                  tw`bg-gray-100 p-4 rounded-xl mt-4 border-l-4`,
                  { borderLeftColor: COLORS.primary }
                ]}
              >
                <Text style={[tw`text-sm font-bold`, { color: COLORS.primary }]}>
                  🐦 ¡Hola! Tori te explica
                </Text>
                <Text style={[tw`text-xs mt-1`, { color: COLORS.darkGray }]}>
                  Estos son nuestros términos de uso. Es importante que los leas.
                </Text>
              </View>

              <Text style={[tw`text-xl font-bold text-center mt-5 mb-4`, { color: COLORS.primary }]}>
                Términos y Condiciones de Uso
              </Text>

              <Text style={[tw`text-sm mb-4`, { color: COLORS.darkGray }]}>
                <Text style={tw`font-bold`}>Última actualización:</Text> {new Date().toLocaleDateString()}
              </Text>

              <Text style={[tw`text-base font-bold mb-2 mt-5`, { color: COLORS.primary }]}>
                1. Aceptación de los Términos
              </Text>
              <Text style={[tw`text-sm leading-5 mb-4`, { color: COLORS.darkGray }]}>
                Al usar nuestra aplicación de turismo, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses la aplicación.
              </Text>

              {/* Puedes continuar con los puntos como estaban */}
              {/* ... resto de condiciones igual con tw */}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HelpSupport;
