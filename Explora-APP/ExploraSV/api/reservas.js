// api/reservas.js - ACTUALIZADO COMPLETO
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para crear una reserva - ACTUALIZADA
export const crearReserva = async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    // NO necesitas enviar Id_Cli5 si usas Sanctum y el usuario está autenticado; Laravel lo detecta del token
    // Pero si lo tienes en el payload no pasa nada, Laravel ignorará el dato recibido
    const response = await api.post('/crear-reserva', payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error en crearReserva:', error);
    console.error('❌ Response status:', error.response?.status);
    console.error('❌ Response data:', error.response?.data);
    
    // Manejo específico de errores del controlador Laravel
    if (error.response?.status === 422) {
      const errorData = error.response.data;
      
      // Errores específicos del controlador
      if (errorData.error === 'Capacidad insuficiente') {
        throw new Error(`${errorData.message}\nDisponible: ${errorData.capacidad_disponible} personas`);
      } else if (errorData.error === 'Habitación no disponible') {
        throw new Error(errorData.message);
      } else if (errorData.error === 'Habitación inválida') {
        throw new Error(errorData.message);
      } else if (errorData.errors) {
        // Errores de validación de Laravel
        const validationMessages = Object.values(errorData.errors).flat();
        throw new Error(`Errores de validación:\n${validationMessages.join('\n')}`);
      } else if (errorData.message) {
        throw new Error(errorData.message);
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

// Función para obtener mis reservas - SIN CAMBIOS
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
    
    if (response.data && response.data.success && Array.isArray(response.data.reservas)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data)) {
      return { success: true, reservas: response.data };
    } else {
      console.warn('⚠️ Formato de respuesta inesperado:', response.data);
      return { success: true, reservas: [] };
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    console.error('❌ Response status:', error.response?.status);
    console.error('❌ Response data:', error.response?.data);
    
    throw new Error(error.response?.data?.message || error.message || 'Error al obtener reservas');
  }
};

// Función para cancelar reserva - SIN CAMBIOS
export const cancelarReserva = async (idReserva) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación');

    // ✅ USAR LA RUTA CORRECTA SEGÚN TU ARCHIVO DE RUTAS
    const response = await api.patch(`/cancelar-reserva/${idReserva}`, {}, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error cancelando reserva:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Reserva no encontrada');
    } else if (error.response?.status === 422) {
      throw new Error('La reserva ya está cancelada');
    }
    
    throw new Error(error.response?.data?.message || 'Error al cancelar la reserva');
  }
};
