// api/reservas.js
import api from '../api'; // Tu instancia de axios

// Función para crear una reserva
export const crearReserva = async (payload) => {
  try {
    console.log('📤 Enviando reserva a la API:', payload);
    const response = await api.post('/crear-reserva', payload);
    console.log('✅ Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en crearReserva:', error);
    throw error;
  }
};

// Función para obtener las reservas del usuario
export const obtenerMisReservas = async () => {
  try {
    const response = await api.get('/mis-reservas');
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo reservas:', error);
    throw error;
  }
};

// Función para cancelar una reserva
export const cancelarReserva = async (id) => {
  try {
    const response = await api.patch(`/cancelar-reserva/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error cancelando reserva:', error);
    throw error;
  }
};
