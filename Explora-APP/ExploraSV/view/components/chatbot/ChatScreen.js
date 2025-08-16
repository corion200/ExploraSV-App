import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import useChatbot from './useChatbot';
import BottomNavBar from '../nav';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

// Componente de punto animado
const AnimatedDot = ({ delay, color, size = 8 }) => {
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const translateY = useRef(new Animated.Value(Math.random() * height)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0.6,
        duration: 1000,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de movimiento flotante continuo
    const floatAnimation = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: Math.random() * width,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: Math.random() * width,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: Math.random() * height * 0.6,
            duration: 12000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: Math.random() * height * 0.6,
            duration: 12000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => floatAnimation());
    };

    floatAnimation();
  }, [translateX, translateY, opacity, scale, delay]);

  return (
    <Animated.View
      style={[
        tw`absolute rounded-full`,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5,
        },
      ]}
    />
  );
};

// Componente de animación de bienvenida
const WelcomeAnimation = ({ visible }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  const dots = [
    { delay: 0, color: '#569298', size: 6 },
    { delay: 200, color: '#D4AF37', size: 8 },
    { delay: 400, color: '#569298', size: 10 },
    { delay: 600, color: '#D4AF37', size: 7 },
    { delay: 800, color: '#569298', size: 9 },
    { delay: 1000, color: '#D4AF37', size: 6 },
    { delay: 1200, color: '#569298', size: 11 },
    { delay: 1400, color: '#D4AF37', size: 8 },
    { delay: 1600, color: '#569298', size: 7 },
    { delay: 1800, color: '#D4AF37', size: 9 },
    { delay: 2000, color: '#569298', size: 6 },
    { delay: 2200, color: '#D4AF37', size: 10 },
  ];

  return (
    <Animated.View
      style={[
        tw`absolute inset-0`,
        {
          opacity: fadeAnim,
          pointerEvents: 'none',
        },
      ]}
    >
      {dots.map((dot, index) => (
        <AnimatedDot
          key={index}
          delay={dot.delay}
          color={dot.color}
          size={dot.size}
        />
      ))}
    </Animated.View>
  );
};

export default function ChatScreen({ navigation }) {
  const { messages, loading, error, sendMessage, clearMessages } = useChatbot();
  const [inputText, setInputText] = useState('');
  const [showAnimation, setShowAnimation] = useState(true);
  const flatListRef = useRef(null);

  // Ocultar animación cuando llegue el primer mensaje
  useEffect(() => {
    if (messages.length > 0) {
      setShowAnimation(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const messageToSend = inputText;
      setInputText('');
      sendMessage(messageToSend);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Limpiar Chat',
      '¿Estás seguro de que quieres limpiar toda la conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive', 
          onPress: () => {
            clearMessages();
            setShowAnimation(true);
          }
        }
      ]
    );
  };

  const renderMessage = ({ item, index }) => (
    <View style={tw`mb-4 px-4 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
      {/* Avatar y nombre de Toru para mensajes del bot */}
      {item.role === 'bot' && (
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`w-10 h-10 rounded-full bg-white justify-center items-center overflow-hidden shadow-md border-2 border-[#D4AF37]`}>
            <Image
              source={require('../../../assets/Favicon25.png')}
              style={tw`w-8 h-8`}
              resizeMode="contain"
            />
          </View>
          <Text style={tw`ml-2 text-[#101C5D] font-bold text-sm`}>Toru</Text>
        </View>
      )}
      
      {/* Burbuja del mensaje */}
      <View style={tw`max-w-4/5 px-4 py-3 rounded-3xl ${
        item.role === 'user' 
          ? 'bg-gradient-to-r from-[#101C5D] to-[#1a2a70] rounded-br-md shadow-lg' 
          : 'bg-white border border-[#569298]/20 rounded-bl-md shadow-md ml-12'
      }`}>
        <Text style={tw`text-base leading-6 ${
          item.role === 'user' ? 'text-white' : 'text-[#333333]'
        }`}>
          {item.text}
        </Text>
      </View>
      
      {/* Timestamp */}
      <Text style={tw`text-xs text-[#333333]/50 mt-1 ${
        item.role === 'user' ? 'mr-2' : 'ml-12'
      }`}>
        {item.timestamp?.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  // Mensajes sugeridos iniciales
  const suggestedMessages = [
    { text: "¡Hola Toru! 👋", icon: "hand-left" },
    { text: "Hoteles recomendados", icon: "bed" },
    { text: "Lugares turísticos", icon: "camera" },
    { text: "¿Dónde comer?", icon: "restaurant" },
  ];

  const sendSuggestedMessage = (message) => {
    sendMessage(message);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F5F5F5]`}>
      <StatusBar backgroundColor="#101C5D" barStyle="light-content" />
      
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header personalizado con gradiente */}
        <View style={tw`flex-row items-center px-4 py-3 bg-[#101C5D] shadow-xl`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3 p-2 rounded-full bg-white/10`}
          >
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={tw`flex-row items-center flex-1`}>
            {/* Avatar de Toru en header */}
            <View style={tw`w-11 h-11 rounded-full bg-white justify-center items-center overflow-hidden border-2 border-[#D4AF37] shadow-lg`}>
              <Image
                source={require('../../../assets/Favicon25.png')}
                style={tw`w-9 h-9`}
                resizeMode="contain"
              />
            </View>
            <View style={tw`ml-3`}>
              <Text style={tw`text-white text-lg font-bold`}>Toru</Text>
              <View style={tw`flex-row items-center`}>
                {loading && (
                  <View style={tw`w-2 h-2 rounded-full bg-[#D4AF37] mr-2`}>
                    <Animated.View style={tw`w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse`} />
                  </View>
                )}
                <Text style={tw`text-white/80 text-sm`}>
                  {loading ? 'Escribiendo...' : 'Tu guía turístico 🇸🇻'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleClearChat}
            style={tw`ml-3 p-2 rounded-full bg-white/10`}
          >
            <Icon name="trash-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Área de mensajes con animación */}
        <View style={tw`flex-1 relative`}>
          {/* Animación de puntos flotantes */}
          <WelcomeAnimation visible={showAnimation && messages.length === 0} />
          
          {/* Lista de mensajes */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => `chatbot-message-${index}`}
            renderItem={renderMessage}
            style={tw`flex-1`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`py-4 pb-24`}
            ListEmptyComponent={
              <View style={tw`flex-1 justify-center items-center px-6 py-8 min-h-96`}>
                {/* Avatar grande de bienvenida con animación */}
                <Animated.View style={tw`w-28 h-28 rounded-full bg-white justify-center items-center mb-6 shadow-2xl border-4 border-[#D4AF37] overflow-hidden`}>
                  <Image
                    source={require('../../../assets/Favicon25.png')}
                    style={tw`w-24 h-24`}
                    resizeMode="contain"
                  />
                </Animated.View>
                
                <Text style={tw`text-3xl font-bold text-[#101C5D] text-center mb-3`}>
                  ¡Hola, soy Toru!
                </Text>
                <Text style={tw`text-[#333333] text-center text-base leading-6 mb-8 px-4`}>
                  Tu torogoz guía personal de ExploraSV.{'\n'}
                  <Text style={tw`text-[#569298] font-semibold`}>
                    ¿Listo para explorar El Salvador?
                  </Text>
                </Text>

                {/* Mensajes sugeridos mejorados */}
                <Text style={tw`text-[#101C5D] font-bold mb-4 text-base`}>
                  Puedes empezar con:
                </Text>
                <View style={tw`flex-row flex-wrap justify-center`}>
                  {suggestedMessages.map((msg, index) => (
                    <TouchableOpacity
                      key={`suggested-${index}`}
                      onPress={() => sendSuggestedMessage(msg.text)}
                      style={tw`bg-white border-2 border-[#D4AF37] px-5 py-3 rounded-full m-1.5 shadow-lg flex-row items-center`}
                      activeOpacity={0.7}
                    >
                      <Icon name={msg.icon} size={16} color="#D4AF37" style={tw`mr-2`} />
                      <Text style={tw`text-[#101C5D] font-semibold text-sm`}>{msg.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />

          {/* Indicador de carga mejorado */}
          {loading && (
            <View style={tw`flex-row items-center px-4 py-3 bg-white/95 backdrop-blur border-t border-[#569298]/10 shadow-sm`}>
              <View style={tw`w-10 h-10 rounded-full bg-white justify-center items-center overflow-hidden border-2 border-[#569298] shadow-md`}>
                <Image
                  source={require('../../../assets/Favicon25.png')}
                  style={tw`w-8 h-8`}
                  resizeMode="contain"
                />
              </View>
              <View style={tw`ml-3 flex-row items-center`}>
                <View style={tw`flex-row`}>
                  <View style={tw`w-2 h-2 rounded-full bg-[#569298] mr-1 animate-bounce`} />
                  <View style={tw`w-2 h-2 rounded-full bg-[#D4AF37] mr-1 animate-bounce delay-100`} />
                  <View style={tw`w-2 h-2 rounded-full bg-[#569298] animate-bounce delay-200`} />
                </View>
                <Text style={tw`ml-3 text-[#333333] text-sm font-medium`}>Toru está escribiendo...</Text>
              </View>
            </View>
          )}

          {/* Mensaje de error mejorado */}
          {error ? (
            <View style={tw`bg-[#F97C7C]/10 mx-4 my-2 p-4 rounded-2xl border-l-4 border-[#F97C7C] flex-row items-center shadow-sm`}>
              <View style={tw`w-8 h-8 rounded-full bg-[#F97C7C]/20 justify-center items-center mr-3`}>
                <Icon name="warning" size={18} color="#F97C7C" />
              </View>
              <Text style={tw`text-[#F97C7C] text-sm flex-1 font-medium`}>{error}</Text>
            </View>
          ) : null}
        </View>

        {/* Input y BottomNavBar en la parte inferior */}
        <View>
          {/* Área de input mejorada */}
          <View style={tw`bg-white border-t border-[#569298]/10 px-4 py-3 shadow-lg`}>
            <View style={tw`flex-row items-end bg-[#F5F5F5] rounded-full px-4 py-2 border-2 border-[#569298]/20`}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe tu mensaje a Toru..."
                style={tw`flex-1 text-base text-[#333333] py-2 max-h-24`}
                multiline={true}
                maxLength={500}
                placeholderTextColor="#9CA3AF"
              />
              
              <TouchableOpacity 
                onPress={handleSend}
                style={tw`w-10 h-10 rounded-full ml-2 justify-center items-center ${
                  (!inputText.trim() || loading) 
                    ? 'bg-[#333333]/20' 
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#c89e2f] shadow-lg'
                }`}
                disabled={!inputText.trim() || loading}
                activeOpacity={0.7}
              >
                <Icon 
                  name="send" 
                  size={20} 
                  color={(!inputText.trim() || loading) ? '#9CA3AF' : 'white'} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}