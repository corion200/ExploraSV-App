import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';


export async function register(Nom_Cli, Correo_Cli, Contra_Cli, Contra_Cli_confirmation) {

  await AsyncStorage.removeItem('Turista');
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

export async function login(Correo_Cli, Contra_Cli,navigation ) {
  try {
    
    const response = await api.post('login', {
      Correo_Cli,
      Contra_Cli,
    });

    const { token, Turista  } = response.data;

    if (token && Turista) {
      // Guardar usuario en AsyncStorage
      await AsyncStorage.setItem('Turista', JSON.stringify(Turista));

      console.log('Login exitoso:', Turista);

      // Redirigir a pantalla principal
      if (navigation && typeof navigation.reset === 'function') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Index' }],
        });
      } else if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('Index');
      }

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

  // Cerrar sesión
  export async function logout(navigation) {
    try {
      await AsyncStorage.removeItem('Turista');
      console.log('Sesión cerrada correctamente');
  
      if (navigation && typeof navigation.reset === 'function') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  }

  // Editar perfil
  export async function updateProfile(userData) {
    try {
      const res = await api.put('/perfil', userData);
      console.log('Perfil actualizado correctamente');
      return res.data.user;  
    } catch (error) {
      console.error('Error al actualizar perfil:', error.response?.data || error.message);
      throw error;
    }
  }