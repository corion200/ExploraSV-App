import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const enviarResena = async ({ Comentario,Id_Siti6,	Id_Cli1  }) => {


  try {
    const response = await api.post('/reviews', {
      Comentario,
      Id_Siti6,
      Id_Cli1,
      
    });

    // Axios ya tiene response.data
    if (response.status !== 201) {
      throw new Error('Error al enviar reseña');
    }

    return response.data; 

  } catch (error) {
    console.error('Error al enviar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};

// Editar reseña
export const editarResena = async ({ Id_Rena, Comentario }) => {
  try {
    const response = await api.put(`/reviews/${Id_Rena}`, { Comentario });
    if (response.status !== 200) {
      throw new Error('Error al editar reseña');
    }
    return response.data;
  } catch (error) {
    console.error('Error al editar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};

// Eliminar reseña
export const eliminarResena = async (Id_Rena) => {
  try {
    const response = await api.delete(`/reviews/${Id_Rena}`);
    if (response.status !== 200) {
      throw new Error('Error al eliminar reseña');
    }
    return response.data;
  } catch (error) {
    console.error('Error al eliminar reseña:', error.response?.data || error.message || error);
    throw error;
  }
};