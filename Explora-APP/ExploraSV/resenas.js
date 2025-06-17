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