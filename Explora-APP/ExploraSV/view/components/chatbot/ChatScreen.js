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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useChatbot from './useChatbot';
import tw from 'twrnc';

export default function ChatScreen({ navigation }) {
  const { messages, loading, error, sendMessage, clearMessages } = useChatbot();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messages.length > 0) {
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
        { text: 'Limpiar', style: 'destructive', onPress: clearMessages }
      ]
    );
  };

  const renderMessage = ({ item, index }) => (
    <View style={tw`mb-4 px-4 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
      {/* Avatar y nombre de Toru para mensajes del bot */}
      {item.role === 'bot' && (
        <View style={tw`flex-row items-center mb-2`}>
          <View style={tw`w-9 h-9 rounded-full bg-green-50 border-2 border-teal-400 justify-center items-center overflow-hidden`}>
            {/* Imagen de Toru en lugar de emoji */}
            <Image
              source={require('../../../assets/Favicon25.png')}
              style={tw`w-7 h-7`}
              resizeMode="contain"
            />
          </View>
          <Text style={tw`ml-2 text-gray-600 font-semibold text-sm`}>Toru</Text>
        </View>
      )}
      
      {/* Burbuja del mensaje */}
      <View style={tw`max-w-4/5 px-4 py-3 rounded-3xl ${
        item.role === 'user' 
          ? 'bg-teal-400 rounded-br-md' 
          : 'bg-white rounded-bl-md shadow-sm border border-gray-100 ml-12'
      }`}>
        <Text style={tw`text-base leading-6 ${
          item.role === 'user' ? 'text-white' : 'text-gray-800'
        }`}>
          {item.text}
        </Text>
      </View>
      
      {/* Timestamp */}
      <Text style={tw`text-xs text-gray-400 mt-1 ${
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
    "¡Hola Toru! 👋",
    "Hoteles recomendados",
    "Lugares turísticos",
    "¿Dónde comer?",
  ];

  const sendSuggestedMessage = (message) => {
    sendMessage(message);
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar backgroundColor="#3FCFB0" barStyle="light-content" />
      
      {/* Header personalizado con Tailwind */}
      <View style={tw`flex-row items-center px-4 py-3 ${Platform.OS === 'ios' ? 'pt-11' : 'pt-3'} bg-teal-400 shadow-lg`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mr-3 p-1`}
        >
          <Icon name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        
        <View style={tw`flex-row items-center flex-1`}>
          {/* Avatar de Toru en header */}
          <View style={tw`w-10 h-10 rounded-full bg-white bg-opacity-20 justify-center items-center overflow-hidden`}>
            {/* Imagen de Toru en header */}
            <Image
              source={require('../../../assets/Favicon25.png')}
              style={tw`w-8 h-8`}
              resizeMode="contain"
            />
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-white text-lg font-bold`}>Toru</Text>
            <Text style={tw`text-green-100 text-sm`}>
              {loading ? 'Escribiendo...' : 'Tu guía turístico'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleClearChat}
          style={tw`ml-3 p-1`}
        >
          <Icon name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`py-4`}
        ListEmptyComponent={
          <View style={tw`flex-1 justify-center items-center px-6 py-8`}>
            {/* Avatar grande de bienvenida */}
            <View style={tw`w-24 h-24 rounded-full bg-green-50 border-4 border-teal-400 justify-center items-center mb-4 shadow-lg overflow-hidden`}>
              {/* Imagen grande de Toru para bienvenida */}
              <Image
                source={require('../../../assets/Favicon25.png')}
                style={tw`w-20 h-20`}
                resizeMode="contain"
              />
            </View>
            
            <Text style={tw`text-2xl font-bold text-gray-800 text-center mb-2`}>
              ¡Hola, soy Toru! 🇸🇻
            </Text>
            <Text style={tw`text-gray-600 text-center text-base leading-6 mb-8 px-4`}>
              Tu torogoz guía personal de ExploraSV.{'\n'}
              ¿Listo para explorar El Salvador?
            </Text>

            {/* Mensajes sugeridos */}
            <Text style={tw`text-gray-800 font-semibold mb-4`}>
              Puedes empezar con:
            </Text>
            <View style={tw`flex-row flex-wrap justify-center`}>
              {suggestedMessages.map((msg, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => sendSuggestedMessage(msg)}
                  style={tw`bg-white border border-teal-400 px-4 py-2 rounded-full m-1 shadow-sm`}
                >
                  <Text style={tw`text-teal-600 font-medium text-sm`}>{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      {/* Indicador de carga */}
      {loading && (
        <View style={tw`flex-row items-center px-4 py-3 bg-gray-50 border-t border-gray-100`}>
          <View style={tw`w-9 h-9 rounded-full bg-green-50 border-2 border-teal-400 justify-center items-center overflow-hidden`}>
            {/* Imagen de Toru en loading */}
            <Image
              source={require('../../../assets/Favicon25.png')}
              style={tw`w-7 h-7`}
              resizeMode="contain"
            />
          </View>
          <View style={tw`ml-3 flex-row items-center`}>
            <ActivityIndicator size="small" color="#3FCFB0" />
            <Text style={tw`ml-2 text-gray-600 text-sm`}>Toru está escribiendo...</Text>
          </View>
        </View>
      )}

      {/* Mensaje de error */}
      {error ? (
        <View style={tw`bg-red-50 mx-4 my-2 p-3 rounded-xl border-l-4 border-red-400 flex-row items-center`}>
          <Icon name="warning" size={16} color="#EF4444" />
          <Text style={tw`text-red-600 text-sm ml-2 flex-1`}>{error}</Text>
        </View>
      ) : null}

      {/* Área de input */}
      <View style={tw`bg-white border-t border-gray-200 px-4 py-3 ${Platform.OS === 'ios' ? 'pb-8' : 'pb-3'}`}>
        <View style={tw`flex-row items-end bg-gray-100 rounded-3xl px-4 py-2 border border-gray-200`}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje a Toru..."
            style={tw`flex-1 text-base text-gray-700 py-2 max-h-24`}
            multiline={true}
            maxLength={500}
            placeholderTextColor="#9CA3AF"
          />
          
          <TouchableOpacity 
            onPress={handleSend}
            style={tw`w-9 h-9 rounded-full ml-2 justify-center items-center ${
              (!inputText.trim() || loading) 
                ? 'bg-gray-200' 
                : 'bg-teal-400 shadow-sm'
            }`}
            disabled={!inputText.trim() || loading}
          >
            <Icon 
              name="send" 
              size={18} 
              color={(!inputText.trim() || loading) ? '#9CA3AF' : 'white'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
