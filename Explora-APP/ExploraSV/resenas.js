import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// tipoLugar puede ser: 'sitio', 'hotel', 'restaurante'
// idLugar es el ID del sitio/hotel/restaurante correspondiente
export const enviarResena = async ({ Comentario, tipoLugar, idLugar, Id_Cli1 }) => {
  try {
    const payload = { Comentario, Id_Cli1 };

    // Asignar el ID según el tipo
    if (tipoLugar === 'sitio') payload.Id_Siti6 = idLugar;
    if (tipoLugar === 'hotel') payload.Id_Hotel5 = idLugar;
    if (tipoLugar === 'restaurante') payload.Id_Rest4 = idLugar;

    const response = await api.post('/reviews', payload);

    if (response.status !== 201) {
      throw new Error('Error al enviar reseña');
    }

    return response.data;
  } catch (error) {
    console.error('Error al enviar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};

// Editar reseña (no cambia, sigue usando solo Id_Rena y Comentario)
export const editarResena = async ({ Id_Rena, Comentario }) => {
  try {
    const response = await api.put(`/reviews/${Id_Rena}`, { Comentario });
    if (response.status !== 200) throw new Error('Error al editar reseña');
    return response.data;
  } catch (error) {
    console.error('Error al editar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};

// Eliminar reseña (no cambia, solo necesita Id_Rena)
export const eliminarResena = async (Id_Rena) => {
  try {
    const response = await api.delete(`/reviews/${Id_Rena}`);
    if (response.status !== 200) throw new Error('Error al eliminar reseña');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};