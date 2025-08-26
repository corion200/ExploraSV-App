import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// tipoLugar: 'sitio' | 'hotel' | 'restaurante'
export const enviarResena = async ({ Comentario, tipoLugar, idLugar }) => {
  try {
    // Obtener token y usuario
    const token = await AsyncStorage.getItem('token');
    const rawUser = await AsyncStorage.getItem('Turista');
    if (!token || !rawUser) throw new Error('No autenticado');

    const user = JSON.parse(rawUser);

    // Resolver ID de usuario con tolerancia a nombres
    const userId =
      user.Id_Cli1 ?? user.Id_Cli ?? user.id ?? user.ID ?? user.userId ?? null;
    if (!userId) throw new Error('ID de usuario no disponible');

    // Construir payload según tipo
    const payload = { Comentario, Id_Cli1: userId };
    if (tipoLugar === 'sitio') payload.Id_Siti6 = idLugar;
    else if (tipoLugar === 'hotel') payload.Id_Hotel5 = idLugar;
    else if (tipoLugar === 'restaurante') payload.Id_Rest4 = idLugar;
    else throw new Error('tipoLugar inválido');

    // Enviar
    const response = await api.post('/reviews', payload);
    if (response.status !== 201) throw new Error('Error al enviar reseña');

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