import React from 'react';
import { View, Text, Image, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import tw from '../tw';
import Comentario from "./reviewSitio";

const screenWidth = Dimensions.get('window').width;
const BASE_URL = "http://192.168.0.13:8000/";

// ✅ FUNCIÓN TRANSFORMAR DATOS OPTIMIZADA
const transformarDatosSitio = (datosRaw) => {
  console.log('=== TRANSFORMANDO DATOS ===');
  console.log('Datos recibidos:', datosRaw);

  // ✅ Si los datos vienen del endpoint /translate-all (ya traducidos)
  if (datosRaw.tipo && datosRaw.nombre && datosRaw.tipo_display) {
    console.log('✅ Usando datos ya traducidos del backend');
    
    return {
      // Campos principales ya traducidos
      Id_Siti: datosRaw.id,
      id: datosRaw.id,
      title: datosRaw.nombre,        // ✅ Ya traducido
      nombre: datosRaw.nombre,       // ✅ Ya traducido  
      descripcion: datosRaw.descripcion, // ✅ Ya traducido
      image: datosRaw.imagen,
      tipo: datosRaw.tipo,
      tipo_display: datosRaw.tipo_display, // ✅ Ya traducido
      
      // Datos adicionales
      puntaje: "4.5",
      location: datosRaw.ubicacion || 'Ubicación no especificada',
      
      // Horario
      horario_inicio: datosRaw.horario_inicio,
      horario_fin: datosRaw.horario_fin,
      horario: datosRaw.horario_inicio && datosRaw.horario_fin 
        ? `${datosRaw.horario_inicio} - ${datosRaw.horario_fin}` 
        : null,
      
      // ✅ Procesar actividades ya traducidas
      actividades: datosRaw.actividades 
        ? (typeof datosRaw.actividades === 'string' 
            ? datosRaw.actividades.split(',').map(act => ({ label: act.trim() }))
            : [])
        : [],
      
      // ✅ Procesar recomendaciones ya traducidas
      recomendaciones: datosRaw.recomendaciones
        ? (typeof datosRaw.recomendaciones === 'string'
            ? datosRaw.recomendaciones.split(',').map(reco => ({ caption: reco.trim() }))
            : [])
        : []
    };
  }

  // Si no vienen traducidos, procesar como datos originales
  console.log('⚠️ Procesando datos sin traducir');
  
  let imagenFinal = datosRaw.imagen_url || datosRaw.image || datosRaw.imagen || datosRaw.Img || null;
  if (imagenFinal && !imagenFinal.startsWith("http")) {
    if (!imagenFinal.startsWith("/")) {
      imagenFinal = "/" + imagenFinal;
    }
    imagenFinal = BASE_URL + imagenFinal;
  }

  let horarioFinal = datosRaw.horario;
  if (!horarioFinal) {
    if (datosRaw.HoraI_Hotel && datosRaw.HoraF_Hotel) {
      horarioFinal = `${datosRaw.HoraI_Hotel} - ${datosRaw.HoraF_Hotel}`;
    } else if (datosRaw.HoraI_Rest && datosRaw.HoraF_Rest) {
      horarioFinal = `${datosRaw.HoraI_Rest} - ${datosRaw.HoraF_Rest}`;
    } else if (datosRaw.HoraI_Siti && datosRaw.HoraF_Siti) {
      horarioFinal = `${datosRaw.HoraI_Siti} - ${datosRaw.HoraF_Siti}`;
    }
  }

  let tipo = 'sitio_turistico';
  if (datosRaw.Nom_Hotel || datosRaw.Precio_Hotel) {
    tipo = 'hotel';
  } else if (datosRaw.Nom_Rest || datosRaw.Tel_Rest) {
    tipo = 'restaurante';
  }

  return {
    Id_Siti: datosRaw.Id_Hotel || datosRaw.Id_Rest || datosRaw.Id_Siti,
    id: datosRaw.Id_Hotel || datosRaw.Id_Rest || datosRaw.Id_Siti,
    image: imagenFinal,
    title: datosRaw.Nom_Hotel || datosRaw.Nom_Rest || datosRaw.Nom_Siti,
    nombre: datosRaw.Nom_Hotel || datosRaw.Nom_Rest || datosRaw.Nom_Siti,
    descripcion: datosRaw.Descrip_Hotel || datosRaw.Descrip_Rest || datosRaw.Descrip_Siti,
    tipo: tipo,
    horario: horarioFinal,
    actividades: datosRaw.Activi_Siti ? 
      datosRaw.Activi_Siti.split(',').map(act => ({ label: act.trim() })) : [],
    recomendaciones: datosRaw.Recomendacione_Siti 
      ? datosRaw.Recomendacione_Siti.split(',').map(reco => ({ caption: reco.trim() }))
      : [],
  };
};

// ✅ COMPONENTE PLANTILLA SITIO
const PlantillaSitio = (props) => {
  const { t, i18n } = useTranslation();
  
  console.log('=== RENDERIZANDO PLANTILLA SITIO ===');
  console.log('Idioma actual:', i18n.language);
  console.log('Datos recibidos:', props);

  const {
    Id_Siti,
    image,
    title,
    puntaje,
    location,
    descripcion,
    horario,
    actividades = [],
    recomendaciones = [],
    tipo = 'sitio_turistico',
    tipo_habitacion,
    cantidad_personas,
    navigation
  } = props;

  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  // ✅ Usar datos ya traducidos del backend
  const displayNombre = title || props.nombre || t('no_specified') || 'Sin nombre';
  const displayDescripcion = descripcion || props.descripcion || t('no_specified') || 'Sin descripción';
  const displayUbicacion = location || props.ubicacion || t('no_specified') || 'Sin ubicación';
  const displayTipo = props.tipo_display || 'Lugar';

  console.log('📍 Renderizando:');
  console.log('- Nombre:', displayNombre);
  console.log('- Descripción (length):', displayDescripcion?.length);
  console.log('- Tipo:', displayTipo);
  console.log('- Actividades:', actividades?.length);
  console.log('- Recomendaciones:', recomendaciones?.length);

  let displayImagenObj;
  if (image && typeof image === 'string' && image.length > 0) {
    displayImagenObj = { uri: image };
  } else if (props.imagen && typeof props.imagen === 'string' && props.imagen.length > 0) {
    displayImagenObj = { uri: props.imagen };
  } else {
    displayImagenObj = require('../../assets/default-image.png');
  }

  const getScheduleTitle = () => {
    switch(tipo) {
      case 'hotel':
        return t('attendance_hours') || 'Horarios de atención:';
      case 'restaurante':
        return t('service_hours') || 'Horarios de servicio:';
      default:
        return t('visit_hours') || 'Horarios de visita:';
    }
  };

  const getReserveButtonText = () => {
    switch(tipo) {
      case 'hotel':
        return t('reserve_hotel') || 'Reservar Hotel';
      case 'restaurante':
        return t('reserve_table') || 'Reservar Mesa';
      default:
        return t('reserve') || 'Reservar';
    }
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Imagen principal */}
        <View style={{ shadowColor: colors.neutralDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 }}>
          <Image
            source={displayImagenObj}
            style={{ width: '100%', height: 310, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
            resizeMode="cover"
          />
        </View>

        {/* Contenido principal */}
        <View style={[tw`bg-white rounded-t-[25px] px-5 pt-6 pb-10 -mt-6`, { shadowColor: colors.neutralDark, shadowOpacity: 0.1, shadowRadius: 6 }]}>
          
          {/* ✅ Título ya traducido */}
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.primary, marginBottom: 6 }}>
            {displayNombre} <Ionicons name="leaf-outline" size={20} color={colors.secondary} />
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: colors.complementary, fontWeight: '600', marginRight: 12 }}>
              ⭐ {puntaje || "4.5"}
            </Text>
            <Ionicons name="location-outline" size={18} color={colors.neutralDark} />
            <Text style={{ color: colors.neutralDark, marginLeft: 4, fontSize: 14 }}>
              {displayUbicacion}
            </Text>
          </View>

          {/* ✅ Descripción ya traducida */}
          <Text style={{ fontSize: 16, lineHeight: 24, color: colors.neutralDark, marginBottom: 18 }}>
            {displayDescripcion}
          </Text>

          {/* Botón de reserva */}
          {(tipo === 'hotel' || tipo === 'restaurante') && navigation && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.complementary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 24,
                shadowColor: colors.complementary,
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 4,
              }}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Reservacion', {
                  tipoLugar: tipo,
                  datosLugar: {
                    id: Id_Siti || props.id,
                    nombre: displayNombre,
                    descripcion: displayDescripcion,
                    imagen: displayImagenObj.uri || null,
                    ubicacion: displayUbicacion,
                    horario_inicio: props.horario_inicio,
                    horario_fin: props.horario_fin,
                    tipo_habitacion: tipo_habitacion,
                    cantidad_personas: cantidad_personas,
                  },
                })
              }
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>
                {getReserveButtonText()}
              </Text>
            </TouchableOpacity>
          )}

          {/* Horario */}
          {horario && horario !== 'null - null' && horario !== ' - ' && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 6 }}>
                {getScheduleTitle()}
              </Text>
              <Text style={{ fontSize: 14, color: colors.neutralDark, marginBottom: 18 }}>
                {horario}
              </Text>
            </>
          )}

          {/* Información específica de hoteles */}
          {tipo === 'hotel' && (
            <>
              {tipo_habitacion && (
                <>
                  <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 6 }}>
                    {t('available_room_types') || 'Tipos de habitación disponibles'}:
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.neutralDark, marginBottom: 18 }}>
                    {tipo_habitacion}
                  </Text>
                </>
              )}
              {cantidad_personas && (
                <>
                  <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 6 }}>
                    {t('max_capacity') || 'Capacidad máxima'}:
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.neutralDark, marginBottom: 18 }}>
                    {cantidad_personas} {t('people') || 'personas'}
                  </Text>
                </>
              )}
            </>
          )}

          {/* ✅ Actividades ya traducidas - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && actividades && actividades.length > 0 && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 12 }}>
                {t('dare_to_try_activities') || 'Atrévete a probar estas actividades'}:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
                {actividades.map((act, i) => (
                  <View
                    key={i}
                    style={{
                      width: 72,
                      alignItems: 'center',
                      marginRight: 10,
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="ribbon-outline" size={28} color={colors.complementary} />
                    <Text
                      style={{
                        marginTop: 6,
                        textAlign: 'center',
                        fontSize: 13,
                        color: colors.neutralDark,
                        fontWeight: '600',
                      }}
                      numberOfLines={2}
                    >
                      {act.label || t('unknown_activity') || 'Actividad'}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ✅ Recomendaciones ya traducidas - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && recomendaciones && recomendaciones.length > 0 && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, textAlign: 'center', marginBottom: 12 }}>
                {t('live_better_experience') || '¡Vive una mejor experiencia!'}
              </Text>
              <FlatList
                horizontal
                data={recomendaciones}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
                renderItem={({ item }) => {
                  let recoImg = item.image;
                  if (recoImg && !recoImg.startsWith("http")) {
                    recoImg = BASE_URL + recoImg.replace(/^\/+/, "");
                  }
                  return (
                    <View
                      style={{
                        width: screenWidth * 0.3,
                        marginRight: 12,
                        borderRadius: 14,
                        overflow: 'hidden',
                        backgroundColor: colors.neutralLight,
                        paddingBottom: 8,
                      }}
                    >
                      <Image
                        source={recoImg ? { uri: recoImg } : require('../../assets/reco.png')}
                        style={{ width: '100%', height: 96 }}
                        resizeMode="cover"
                      />
                      <Text
                        style={{
                          marginTop: 8,
                          color: colors.neutralDark,
                          fontWeight: '600',
                          fontSize: 12,
                          textAlign: 'center',
                        }}
                        numberOfLines={2}
                      >
                        {item.caption || t('no_description') || 'Sin descripción'}
                      </Text>
                    </View>
                  );
                }}
              />
            </>
          )}

         {/* Comentarios */}
         <Comentario Id_Siti={Id_Siti} tipo={tipo} />
        </View>
      </ScrollView>
    </View>
  );
};

export { PlantillaSitio, transformarDatosSitio };
export default PlantillaSitio;
