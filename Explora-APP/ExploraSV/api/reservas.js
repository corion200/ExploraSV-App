// api/reservas.js - Archivo completo
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para crear una reserva
export const crearReserva = async (payload) => {
  try {
    console.log('📤 Enviando reserva a la API:', payload);
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');

    const response = await api.post('/crear-reserva', payload, {
      headers: {
        ...(api.defaults.headers?.common || {}),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en crearReserva:', error);
    console.error('❌ Response status:', error.response?.status);
    console.error('❌ Response data:', error.response?.data);
    
    // Manejo específico de errores de validación (422)
    if (error.response?.status === 422) {
      const errorData = error.response.data;
      
      if (errorData.errors) {
        // Errores de validación de Laravel
        const validationMessages = Object.values(errorData.errors).flat();
        throw new Error(`Errores de validación:\n${validationMessages.join('\n')}`);
      } else if (errorData.message) {
        throw new Error(errorData.message);
      } else if (errorData.error) {
        throw new Error(errorData.error);
      }
      
      throw new Error('Error de validación en los datos enviados');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Sesión expirada o token inválido. Por favor, inicia sesión nuevamente.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('El lugar solicitado no existe.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Error interno del servidor. Inténtalo más tarde.');
    }
    
    throw new Error(error.message || 'Error desconocido al crear la reserva');
  }
};

// api/reservas.js - Función actualizada
export const obtenerMisReservas = async () => {
  try {
    console.log('📡 Iniciando petición a misReservas...');
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
    }

    const response = await api.get('/mis-reservas', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Respuesta API misReservas recibida:', response.data);
    
    // ✅ Verificar que la respuesta tenga el formato esperado
    if (response.data && response.data.success && Array.isArray(response.data.reservas)) {
      return response.data; // { success: true, reservas: [...] }
    } else if (response.data && Array.isArray(response.data)) {
      // Si la API devuelve directamente un array
      return { success: true, reservas: response.data };
    } else {
      console.warn('⚠️ Formato de respuesta inesperado:', response.data);
      return { success: true, reservas: [] };
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    console.error('❌ Response status:', error.response?.status);
    console.error('❌ Response data:', error.response?.data);
    
    // ✅ En caso de error, devolver estructura consistente
    throw new Error(error.response?.data?.message || error.message || 'Error al obtener reservas');
  }
};


// Función para cancelar reserva
export const cancelarReserva = async (idReserva) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    const response = await api.put(`/reservas/${idReserva}/cancelar`, {}, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error cancelando reserva:', error);
    throw error;
  }
};
