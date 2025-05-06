import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de tu API Laravel (usando la IP de tu máquina local en desarrollo)
const API_URL = 'http://192.168.0.12:8000/api'; // Sustituye por la IP de tu máquina

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para agregar token en las cabeceras
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;