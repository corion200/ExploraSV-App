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
import { useTranslation } from 'react-i18next';

export default function Comentario({ Id_Siti, tipo }) {
  const [reviewText, setReviewText] = useState('');
  const [Id_Cli, setIdUsuario] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [userData, setUserData] = useState(null);
  const { t } = useTranslation();

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
      const tipoLugar =
        tipo === 'sitio_turistico' ? 'sitio' : tipo === 'hotel' ? 'hotel' : 'restaurante';
      const response = await api.get(`/lugares/${tipoLugar}/${Id_Siti}/reviews`);
      setResenas(response.data);
    } catch (error) {
      console.error('Error al obtener reseñas:', error?.response?.data || error.message);
      setResenas([]);
    }
  };

  const handlePublish = async () => {
    if (!reviewText.trim()) return;
    if (!Id_Cli) {
      alert(t('login_required_publish'));
      return;
    }

    try {
      await enviarResena({
        Comentario: reviewText,
        Id_Cli1: Id_Cli,
        tipoLugar: tipo === 'sitio_turistico' ? 'sitio' : tipo === 'hotel' ? 'hotel' : 'restaurante',
        idLugar: Id_Siti,
      });

      setReviewText('');
      obtenerResenas(Id_Cli);
    } catch (error) {
      console.error('Error al publicar la reseña:', error);
      alert(t('error_publish_review'));
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
        <Text style={tw`font-semibold mb-1`}>{item.turista?.Nom_Cli || t('anonymous')}</Text>

        {editando ? (
          <>
            <TextInput
              value={textoEditado}
              onChangeText={setTextoEditado}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={[tw`bg-white rounded border border-gray-400 p-2 mb-2`, { fontSize: 14, minHeight: 60 }]}
            />
            <View style={tw`flex-row justify-end space-x-2`}>
              <TouchableOpacity onPress={handleEditar} style={tw`bg-green-600 rounded px-4 py-1 mr-2`}>
                <Text style={tw`text-white`}>{t('save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditando(false)} style={tw`bg-gray-400 rounded px-4 py-1`}>
                <Text style={tw`text-white`}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={tw`mb-2`}>{item.comentario || item.Comentario}</Text>

            {esPropietario && (
              <View style={tw`flex-row justify-end space-x-2`}>
                <TouchableOpacity onPress={() => setEditando(true)} style={tw`bg-blue-600 rounded px-3 py-1 mr-2`}>
                  <Text style={tw`text-white`}>{t('edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEliminar} style={tw`bg-red-600 rounded px-3 py-1`}>
                  <Text style={tw`text-white`}>{t('delete')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={tw`text-base text-[#101C5D] font-bold mb-4 mt-8`}>{t('reviews')}</Text>
            {userData ? (
              <>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder={t('write_review_here')}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={[tw`bg-gray-100 rounded-lg text-gray-700 mb-4`, { height: 100, fontSize: 14 }]}
                />

                <TouchableOpacity
                  onPress={handlePublish}
                  style={tw`bg-[#101C5D] rounded-lg py-3 px-6 items-center mb-6`}
                >
                  <Text style={tw`text-white font-semibold text-sm`}>{t('publish')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={tw`bg-red-100 border border-red-400 rounded-lg p-4 mb-4 flex-row items-center`}>
                <Icon name="alert-circle-outline" size={20} color="#dc2626" style={tw`mr-2`} />
                <Text style={tw`text-red-700 font-semibold flex-shrink`}>
                  {t('login_required_comment')}
                </Text>
              </View>
            )}

            <Text style={tw`text-base font-bold mb-2`}>{t('recent_comments')}</Text>
          </View>
        }
        data={resenas}
        contentContainerStyle={tw`px-4 pb-25`}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.Id_Rena?.toString() || index.toString()}
        renderItem={({ item }) => <ResenaItem item={item} />}
        ListEmptyComponent={<Text style={tw`text-gray-500 text-center mt-4`}>{t('no_reviews_yet')}</Text>}
      />
    </KeyboardAvoidingView>
  );
}
