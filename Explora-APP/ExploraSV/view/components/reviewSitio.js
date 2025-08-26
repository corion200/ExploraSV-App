import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

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

export default function Comentario({ Id_Siti, tipo}) {
  const [reviewText, setReviewText] = useState('');
  const [Id_Cli, setIdUsuario] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const cargarUsuario = async () => {
        try {
          const userData = await AsyncStorage.getItem('Turista');
          if (!isActive) return;
  
          const user = userData ? JSON.parse(userData) : null;
          setUserData(user);
          setIdUsuario(user?.Id_Cli ?? null);
  
          // 🔹 Cargar reseñas después de tener el Id del usuario
          obtenerResenas(user?.Id_Cli ?? null);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          setUserData(null);
          setIdUsuario(null);
        }
      };
  
      cargarUsuario();
  
      return () => {
        isActive = false;
      };
    }, [Id_Siti])
  );

  const obtenerResenas = async () => {
    try {
      const tipoLugar = tipo === 'sitio_turistico' ? 'sitio' : tipo === 'hotel' ? 'hotel' : 'restaurante';
      const response = await api.get(`/lugares/${tipoLugar}/${Id_Siti}/reviews`);
      setResenas(response.data);
    } catch (error) {
      console.error('Error al obtener reseñas:', error?.response?.data || error.message);
      // En caso de error (no hay reseñas), establecemos array vacío
      setResenas([]);
    }
  };

  const handlePublish = async () => {
    if (!reviewText.trim()) return;
    if (!Id_Cli) {
      alert('Debes iniciar sesión para publicar una reseña.');
      return;
    }
  
    try {
      await enviarResena({
        Comentario: reviewText,
        Id_Cli1: Id_Cli,
        tipoLugar: tipo === 'sitio_turistico' ? 'sitio' : tipo === 'hotel' ? 'hotel' : 'restaurante',
        idLugar: Id_Siti
      });
  
      setReviewText('');
      obtenerResenas(Id_Cli);
    } catch (error) {
      console.error('Error al publicar la reseña:', error);
      alert('Ocurrió un error al publicar tu reseña.');
    }
  };
  

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
          {item.turista?.Nom_Cli || 'Anónimo'}
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
              <View style={tw`flex-row justify-end space-x-2`}>
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
            <Text style={tw`text-base text-[#101C5D] font-bold mb-4`}>Reseñas</Text>
            {userData ? (
              <>
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
              </>
            ) : (
              <View
                style={tw`bg-red-100 border border-red-400 rounded-lg p-4 mb-4 flex-row items-center`}
              >
                <Icon
                  name="alert-circle-outline"
                  size={20}
                  color="#dc2626"
                  style={tw`mr-2`}
                />
                <Text style={tw`text-red-700 font-semibold flex-shrink`}>
                  Debes iniciar sesión para poder comentar.
                </Text>
              </View>
            )}

            <Text style={tw`text-base font-bold mb-2`}>Comentarios recientes</Text>
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