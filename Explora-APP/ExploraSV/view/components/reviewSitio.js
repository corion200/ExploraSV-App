import React, { useState, useEffect } from 'react';
import { View, Text,  TextInput, TouchableOpacity,  } from 'react-native'; // <-- aquí el Image
import tw from '../tw';
import { enviarResena } from '../../resenas'; 

import AsyncStorage from '@react-native-async-storage/async-storage'; // todavía no lo usas

export default function Comentario({Id_Siti }) {
const [reviewText, setReviewText] = useState('');
const [Id_Cli, setIdUsuario] = useState(null);

  useEffect(() => {
    const cargarIdUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem('Turista');
        if (userData) {
          const user = JSON.parse(userData);
          setIdUsuario(user?.Id_Cli || user?.id || null); // ajusta según tu estructura
          console.log('ID del usuario:', user?.Id_Cli || user?.id);
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error.message);
      }
    };

    cargarIdUsuario();
  }, []);

  const handlePublish = async () => {
    if (!reviewText.trim()) return;

    try {
      const data = await enviarResena({
        Comentario: reviewText,
        Id_Siti6: Id_Siti,
        Id_Cli1: Id_Cli,
      });

      console.log('Reseña publicada con éxito:', data);
      alert('¡Gracias por tu reseña!');
      setReviewText('');
    } catch (error) {
      console.error('Error al publicar la reseña:', error);
      alert('Ocurrió un error al publicar tu reseña.');
    }
  };

 return (
    <View style={tw`p-4 bg-white`}>
        {/* Título */}
        <Text style={tw`text-base font-bold  mb-4`}>
          Reseñas
        </Text>

        {/* Caja de texto */}
        <View style={tw`mb-4`}>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Escribe tu reseña aquí..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              tw`bg-gray-100 rounded-lg p-4 text-gray-700`,
              { 
                height: 100,
                fontSize: 14,
              }
            ]}
          />
        </View>

        {/* Botón de publicar */}
        <TouchableOpacity
          onPress={handlePublish}
          style={[
            tw`bg-[#101C5D] rounded-lg py-3 px-6 items-center mb-40 `,
          ]}
        
          value={reviewText}
        >
          <Text style={tw`text-white font-semibold text-base`}>
            Publicar
          </Text>
        </TouchableOpacity>
     
    </View>
    
    

  
  );
}

