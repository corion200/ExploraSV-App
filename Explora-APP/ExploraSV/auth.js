import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';


export async function register(Nom_Cli, Correo_Cli, Contra_Cli, Contra_Cli_confirmation) {
  try {
    const response = await api.post('/register', {
      Nom_Cli,
      Correo_Cli,
      Contra_Cli,
      Contra_Cli_confirmation,
    });
    

    const token = response.data.token;

    if (token) {
      await AsyncStorage.setItem('authToken', token);
      console.log('Usuario registrado y autenticado');
      return response.data;
    } else {
      throw new Error('No se recibió token');
    }
  } catch (error) {
    console.error('Error en registro:', error.response?.data || error.message);
    return null;
  }
}

export async function login(Correo_Cli, Contra_Cli) {
    try {
      const response = await api.post('login', {
        Correo_Cli,
        Contra_Cli,
      });
  
      const { token, Turista } = response.data;
  
      if (token && Turista) {
        // Guardamos token y usuario en AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('Turista', JSON.stringify(Turista));
        console.log('Login exitoso:', Turista);
        return response.data;
      } else {
        throw new Error('Datos incompletos recibidos del servidor');
      }
    } catch (error) {
      console.error('Error al hacer login:', error.response?.data || error.message);
      return null;
    }
  }

  export async function getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem('Turista');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error.message);
      return null;
    }
  }