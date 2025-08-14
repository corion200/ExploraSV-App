import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from '../tw';
import api from '../../api';
import { enviarResena, editarResena, eliminarResena } from '../../resenas';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Comentario({ Id_Siti }) {

  const [reviewText, setReviewText] = useState('');
  const [Id_Cli, setIdUsuario] = useState(null);
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    const cargarIdUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem('Turista');
        if (userData) {
          const user = JSON.parse(userData);
          setIdUsuario(user?.Id_Cli || user?.id || null);
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error.message);
      }
    };

    cargarIdUsuario();
    obtenerResenas();
  }, []);

  const obtenerResenas = async () => {
    try {
      const response = await api.get(`/lugares/${Id_Siti}/reviews`);
      setResenas(response.data);
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
    }
  };

  const handlePublish = async () => {
    if (!reviewText.trim()) return;

    try {
      await enviarResena({
        Comentario: reviewText,
        Id_Siti6: Id_Siti,   
        Id_Cli1: Id_Cli,     
      });

      alert('¡Gracias por tu reseña!');
      setReviewText('');
      obtenerResenas(); // actualizar lista después de enviar
    } catch (error) {
      console.error('Error al publicar la reseña:', error);
      alert('Ocurrió un error al publicar tu reseña.');
    }
  };

   // Componente para cada reseña con su propio estado
  const ResenaItem = ({ item }) => {
    const [editando, setEditando] = useState(false);
    const [textoEditado, setTextoEditado] = useState(item.Comentario || item.comentario);
    const esPropietario = item.Id_Cli1 === Id_Cli;

    const handleEditar = async () => {
      try {
        await editarResena({ Id_Rena: item.Id_Rena, Comentario: textoEditado });
        setEditando(false);
        obtenerResenas();
      } catch (error) {
        console.error('Error al editar reseña:', error);
      }
    };
    
    const handleEliminar = async () => {
      try {
        await eliminarResena(item.Id_Rena);
        obtenerResenas();
      } catch (error) {
        console.error('Error al eliminar reseña:', error);
      }
    };

    return (
      <View style={tw`bg-gray-100 rounded-lg p-3 mb-2`}>
        <Text style={tw`font-semibold mb-1`}>
          {item.usuario?.Nom_Cli || 'Anónimo'}
        </Text>

        {editando ? (
          <>
            <TextInput
              value={textoEditado}
              onChangeText={setTextoEditado}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={[
                tw`bg-white rounded border border-gray-400 p-2 mb-2`,
                { fontSize: 14, minHeight: 60 },
              ]}
            />
            <View style={tw`flex-row justify-end space-x-2`}>
              <TouchableOpacity
                onPress={handleEditar}
                style={tw`bg-green-600 rounded px-4 py-1 mr-2`}
              >
                <Text style={tw`text-white`}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditando(false)}
                style={tw`bg-gray-400 rounded px-4 py-1`}
              >
                <Text style={tw`text-white`}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={tw`mb-2`}>{item.comentario || item.Comentario}</Text>

            {esPropietario && (
              <View style={tw`flex-row justify-end space-x-3`}>
                <TouchableOpacity
                  onPress={() => setEditando(true)}
                  style={tw`bg-blue-600 rounded px-3 py-1 mr-2`}
                >
                  <Text style={tw`text-white`}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleEliminar}
                  style={tw`bg-red-600 rounded px-3 py-1`}
                >
                  <Text style={tw`text-white`}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={tw`text-base font-bold mb-4`}>Reseñas</Text>

            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Escribe tu reseña aquí..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[
                tw`bg-gray-100 rounded-lg text-gray-700 mb-4`,
                { height: 100, fontSize: 14 },
              ]}
            />

            <TouchableOpacity
              onPress={handlePublish}
              style={tw`bg-[#101C5D] rounded-lg py-3 px-6 items-center mb-6`}
            >
              <Text style={tw`text-white font-semibold text-sm`}>Publicar</Text>
            </TouchableOpacity>

            <Text style={tw`text-base font-bold mb-2`}>
              Comentarios recientes
            </Text>
          </View>
        }
        data={resenas}
        contentContainerStyle={tw`px-4 pb-25`}
        scrollEnabled={false}
        keyExtractor={(item, index) =>
          item.Id_Rena?.toString() || item.Id_Rena?.toString() || index.toString()
        }
        renderItem={({ item }) => <ResenaItem item={item} />}
        ListEmptyComponent={
          <Text style={tw`text-gray-500 text-center mt-4`}>
            No hay reseñas aún.
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}