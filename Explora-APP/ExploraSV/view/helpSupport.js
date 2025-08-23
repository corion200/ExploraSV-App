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
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
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
        text2: 'Toru necesita que completes todos los campos.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    Toast.show({
      type: 'success',
      text1: '🐦 ¡Reporte enviado!',
      text2: 'Toru ha recibido tu reporte. Te responderemos pronto.',
    });

    // Limpiar y cerrar
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
      style={{
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.darkGray,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: `${color}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      }}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: 5,
        }}>
          {title}
        </Text>
        <Text style={{
          fontSize: 13,
          color: COLORS.darkGray,
          lineHeight: 18,
        }}>
          {subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.darkGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginLeft: 15
        }}>
          Ayuda y Soporte
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mensaje de Toru */}
        <View style={{
          backgroundColor: COLORS.white,
          marginHorizontal: 20,
          marginTop: 20,
          padding: 20,
          borderRadius: 15,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.gold,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: COLORS.primary,
            marginBottom: 8,
          }}>
            🐦 ¡Hola! Soy Toru, tu asistente de viajes
          </Text>
          <Text style={{
            fontSize: 14,
            color: COLORS.darkGray,
            lineHeight: 20,
          }}>
            Estoy aquí para ayudarte con cualquier duda o problema. ¡Elige cómo prefieres que te ayude!
          </Text>
        </View>

        {/* Sección de Contacto */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginHorizontal: 20,
          marginTop: 30,
          marginBottom: 15,
        }}>
          💬 Contacto Directo
        </Text>

        <MenuCard
          icon="🐦"
          title="Chat con Toru"
          subtitle="Chatea conmigo para resolver dudas rápidas"
          onPress={() => {chatbotApi(); navigation.navigate('ChatScreen');}}
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

        {/* Sección de Reportes */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginHorizontal: 20,
          marginTop: 30,
          marginBottom: 15,
        }}>
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

        {/* Sección Legal */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.primary,
          marginHorizontal: 20,
          marginTop: 30,
          marginBottom: 15,
        }}>
          📋 Información Legal
        </Text>

        <MenuCard
          icon="📄"
          title="Términos y Condiciones"
          subtitle="Lee nuestros términos de uso y política de privacidad"
          onPress={() => setTermsModalVisible(true)}
          color={COLORS.primary}
        />

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modal de Reporte de Problemas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
            maxHeight: '80%',
          }}>
            {/* Header del Modal */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
                🐛 Reportar Problema
              </Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Mensaje de Toru */}
              <View style={{
                backgroundColor: COLORS.lightGray,
                padding: 15,
                borderRadius: 10,
                marginBottom: 20,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.coral,
              }}>
                <Text style={{
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                  🐦 ¡Cuéntale a Toru qué pasó!
                </Text>
                <Text style={{
                  color: COLORS.darkGray,
                  fontSize: 12,
                  marginTop: 5,
                }}>
                  Entre más detalles nos des, mejor podremos ayudarte.
                </Text>
              </View>

              {/* Tipo de Problema */}
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 8,
              }}>
                Tipo de Problema
              </Text>
              <View style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 10,
                marginBottom: 15,
              }}>
                <Picker
                  selectedValue={problemType}
                  onValueChange={setProblemType}
                  style={{ height: 50 }}
                >
                  {problemTypes.map((type) => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>

              {/* Título */}
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 8,
              }}>
                Título del Problema
              </Text>
              <TextInput
                value={problemTitle}
                onChangeText={setProblemTitle}
                placeholder="Ejemplo: La app se cierra al abrir reservas"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 15,
                  fontSize: 14,
                }}
                placeholderTextColor="#999"
              />

              {/* Descripción */}
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 8,
              }}>
                Describe el Problema
              </Text>
              <TextInput
                value={problemDescription}
                onChangeText={setProblemDescription}
                placeholder="Cuéntanos qué estabas haciendo cuando ocurrió el problema..."
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 15,
                  fontSize: 14,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor="#999"
              />

              {/* Email */}
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 8,
              }}>
                Tu Email (para respuesta)
              </Text>
              <TextInput
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 25,
                  fontSize: 14,
                }}
                placeholderTextColor="#999"
              />

              {/* Botón Enviar */}
              <TouchableOpacity
                onPress={handleSubmitReport}
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#D3D3D3' : COLORS.coral,
                  paddingVertical: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginBottom: 30,
                }}
              >
                <Text style={{
                  color: COLORS.white,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                  {isSubmitting ? '🐦 Enviando...' : '🐦 Enviar Reporte'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Términos y Condiciones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, marginTop: 50, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            {/* Header del Modal */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E5E5'
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
                📄 Términos y Condiciones
              </Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>

            {/* Contenido de Términos */}
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
              <View style={{
                backgroundColor: COLORS.lightGray,
                padding: 15,
                borderRadius: 10,
                marginTop: 15,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.primary,
              }}>
                <Text style={{
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                  🐦 ¡Hola! Toru te explica
                </Text>
                <Text style={{
                  color: COLORS.darkGray,
                  fontSize: 12,
                  marginTop: 5,
                }}>
                  Estos son nuestros términos de uso. Es importante que los leas.
                </Text>
              </View>

              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginTop: 20,
                marginBottom: 15,
                textAlign: 'center'
              }}>
                Términos y Condiciones de Uso
              </Text>

              <Text style={{ color: COLORS.darkGray, fontSize: 14, marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>Última actualización:</Text> {new Date().toLocaleDateString()}
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10,
                marginTop: 20
              }}>
                1. Aceptación de los Términos
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                Al usar nuestra aplicación de turismo, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses la aplicación.
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                2. Uso del Servicio
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                Nuestra app te ayuda a descubrir lugares turísticos, hoteles y restaurantes, además de permitirte hacer reservas y escribir reseñas.
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                3. Tu Cuenta
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                • Debes ser mayor de 18 años{'\n'}
                • Proporciona información verdadera{'\n'}
                • Mantén tu contraseña segura{'\n'}
                • Eres responsable de tu cuenta
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                4. Reservas
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                • Las reservas están sujetas a disponibilidad{'\n'}
                • Los precios pueden cambiar{'\n'}
                • Revisa las políticas de cancelación{'\n'}
                • Los pagos son procesados de forma segura
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                5. Reseñas y Contenido
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                • Escribe reseñas honestas y verdaderas{'\n'}
                • No publiques contenido ofensivo{'\n'}
                • Respeta a otros usuarios{'\n'}
                • Podemos usar tu contenido para mejorar el servicio
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                6. Privacidad
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 15 }}>
                Respetamos tu privacidad. Lee nuestra política de privacidad para entender cómo manejamos tus datos.
              </Text>

              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.primary,
                marginBottom: 10
              }}>
                7. Contacto
              </Text>
              <Text style={{ color: COLORS.darkGray, fontSize: 14, lineHeight: 20, marginBottom: 50 }}>
                Si tienes preguntas, contáctanos:{'\n'}
                📧 soporte@tuapp.com{'\n'}
                📱 +52 123 456 7890{'\n'}
                🐦 Chat con Toru en la app
              </Text>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HelpSupport;
