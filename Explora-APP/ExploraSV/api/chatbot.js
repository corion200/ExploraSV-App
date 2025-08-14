import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cambia esta línea por tu IP local
const CHATBOT_BASE_URL = 'http://192.168.1.17:5000'; // Tu IP aquí

export const chatbotApi = axios.create({
  baseURL: CHATBOT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para agregar token de autorización
chatbotApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función principal para enviar mensajes al chatbot
export async function sendMessageToChatbot(message) {
  try {
    const response = await chatbotApi.post('/chatbot', { message });
    return response.data; // Espera: { response: '...' }
  } catch (error) {
    console.error('Error comunicándose con chatbot:', error);
    throw error;
  }
}

// Función para verificar salud del servicio
export async function checkChatbotHealth() {
  try {
    const response = await chatbotApi.get('/health');
    return response.data;
  } catch (error) {
    console.error('Chatbot no disponible:', error);
    throw error;
  }
}
