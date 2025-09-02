import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function login(Correo_Cli, Contra_Cli, navigation, Id_Cli) {
  try {
    const response = await api.post('/login', {
      Correo_Cli,
      Contra_Cli,
      Id_Cli
    });

    const { token, Turista } = response.data;

    if (token && Turista) {
      // Guarda token y usuario
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('Turista', JSON.stringify(Turista));

      console.log('Tori dio la bienvenida a:', Turista.Nom_Cli);
    
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
      console.log('Tori dice: Credenciales incorrectas');
      return null;
    }
  } catch (error) {
    console.log('Tori no pudo conectarse:', error.response?.data?.message || 'Credenciales incorrectas');
    return null;
  }
}
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
      console.log('Tori registró exitosamente al usuario');
      return response.data;
    } else {
      console.log('Tori dice: No se recibió token del servidor');
      return { 
        success: false, 
        message: 'Tori no pudo completar el registro. Intenta de nuevo.' 
      };
    }
  } catch (error) {
    console.log('Tori encontró un problema en el registro:', error.response?.data || error.message);
    
    return { 
      success: false, 
      message: error.response?.data?.message || 'Tori no pudo registrarte en este momento',
      errors: error.response?.data?.errors || null
    };
  }
}


export async function getCurrentUser() {
  try {
    const user = await AsyncStorage.getItem('Turista');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log('Error al obtener usuario:', error.message);
    return null;
  }
}


// Editar perfil
export async function updateProfile(userData) {
  try {
    const res = await api.put('/perfil', userData);
    console.log('Perfil actualizado correctamente');
    return res.data.user;  
  } catch (error) {
    console.log('Error al actualizar perfil:', error.response?.data || error.message);
    // En este caso sí lanzamos error porque es una función que requiere manejo específico
    throw error;
  }
}