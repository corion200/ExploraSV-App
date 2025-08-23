import React from 'react';
import { View, Text, Image, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from '../tw';
import Comentario from "./reviewSitio";

const screenWidth = Dimensions.get('window').width;

const BASE_URL = "http://192.168.1.17:8000/";
// Cambia esta IP y puerto a los de tu backend local
const BASE_URL = "http://192.168.0.13:8000/";

const transformarDatosSitio = (datosRaw) => {
  console.log('=== TRANSFORMANDO DATOS ===');
  console.log('Datos crudos recibidos:', JSON.stringify(datosRaw, null, 2));

  let imagenFinal = datosRaw.imagen_url || datosRaw.image || datosRaw.imagen || datosRaw.Img || datosRaw.Img_Hotel || datosRaw.Img_Rest || null;
  if (imagenFinal && !imagenFinal.startsWith("http")) {
    if (!imagenFinal.startsWith("/")) {
      imagenFinal = "/" + imagenFinal;
    }
    imagenFinal = BASE_URL + imagenFinal;
  }

  // Procesar horario según el tipo
  let horarioFinal = datosRaw.horario;
  console.log('Horario inicial:', horarioFinal);
  
  if (!horarioFinal) {
    console.log('Buscando horarios en campos específicos...');
    console.log('HoraI_Hotel:', datosRaw.HoraI_Hotel, 'HoraF_Hotel:', datosRaw.HoraF_Hotel);
    console.log('HoraI_Rest:', datosRaw.HoraI_Rest, 'HoraF_Rest:', datosRaw.HoraF_Rest);
    console.log('HoraI_Siti:', datosRaw.HoraI_Siti, 'HoraF_Siti:', datosRaw.HoraF_Siti);
    
    if (datosRaw.HoraI_Hotel && datosRaw.HoraF_Hotel) {
      horarioFinal = `${datosRaw.HoraI_Hotel} - ${datosRaw.HoraF_Hotel}`;
      console.log('Horario hotel asignado:', horarioFinal);
    } else if (datosRaw.HoraI_Rest && datosRaw.HoraF_Rest) {
      horarioFinal = `${datosRaw.HoraI_Rest} - ${datosRaw.HoraF_Rest}`;
      console.log('Horario restaurante asignado:', horarioFinal);
    } else if (datosRaw.HoraI_Siti && datosRaw.HoraF_Siti) {
      horarioFinal = `${datosRaw.HoraI_Siti} - ${datosRaw.HoraF_Siti}`;
      console.log('Horario sitio asignado:', horarioFinal);
    }
  }

  // DETERMINAR EL TIPO Y BOTÓN DE RESERVA
  let tipo = 'sitio_turistico'; // Default
  let mostrarBotonReserva = false;
  let esReservable = false;

  // Detectar tipo basado en los campos presentes
  if (datosRaw.Nom_Hotel || datosRaw.Precio_Hotel || datosRaw.Tel_Hotel || datosRaw.HoraI_Hotel) {
    tipo = 'hotel';
    mostrarBotonReserva = true;
    esReservable = true;
    console.log('🏨 Detectado como HOTEL');
  } else if (datosRaw.Nom_Rest || datosRaw.Tel_Rest || datosRaw.HoraI_Rest || datosRaw.Tipo_Comida_Rest) {
    tipo = 'restaurante';
    mostrarBotonReserva = true;
    esReservable = true;
    console.log('🍽️ Detectado como RESTAURANTE');
  } else if (datosRaw.Nom_Siti || datosRaw.Activi_Siti) {
    tipo = 'sitio_turistico';
    mostrarBotonReserva = false;
    esReservable = false;
    console.log('🏞️ Detectado como SITIO TURÍSTICO');
  }

  console.log('Tipo detectado:', tipo);
  console.log('Mostrar botón reserva:', mostrarBotonReserva);
  console.log('Es reservable:', esReservable);

  // ⭐ MAPEAR A LOS CAMPOS QUE ESPERA EL COMPONENTE PLANTILLASITIO
  const datosTransformados = {
    // Campos que usa PlantillaSitio
    Id_Siti: datosRaw.Id_Hotel || datosRaw.Id_Rest || datosRaw.Id_Siti,
    id: datosRaw.Id_Hotel || datosRaw.Id_Rest || datosRaw.Id_Siti,
    image: imagenFinal,
    title: datosRaw.Nom_Hotel || datosRaw.Nom_Rest || datosRaw.Nom_Siti,
    nombre: datosRaw.Nom_Hotel || datosRaw.Nom_Rest || datosRaw.Nom_Siti,
    puntaje: datosRaw.puntaje || datosRaw.rating || "4.5", // Default
    location: datosRaw.Nom_Zon || datosRaw.zona || datosRaw.ubicacion,
    descripcion: datosRaw.Descrip_Hotel || datosRaw.Descrip_Rest || datosRaw.Descrip_Siti,
    horario: horarioFinal,
    horario_inicio: datosRaw.HoraI_Hotel || datosRaw.HoraI_Rest || datosRaw.HoraI_Siti,
    horario_fin: datosRaw.HoraF_Hotel || datosRaw.HoraF_Rest || datosRaw.HoraF_Siti,
    telefono: datosRaw.Tel_Hotel || datosRaw.Tel_Rest || datosRaw.Tel_Siti,
    
    // Configuración de tipo y reserva
    tipo: tipo,
    mostrarBotonReserva: mostrarBotonReserva,
    esReservable: esReservable,
    
    // Campos específicos de hotel
    tipo_habitacion: datosRaw.Tipo_Hab_Hotel,
    cantidad_personas: datosRaw.Capacidad_Hotel || datosRaw.Capacidad_Rest,
    
    // Campos específicos de restaurante
    tipoComida: datosRaw.Tipo_Comida_Rest,
    precioPromedio: datosRaw.Precio_Prom_Rest,
    
    // Campos para sitios turísticos
    precios: datosRaw.Precio_Entra_Siti ? [datosRaw.Precio_Entra_Siti] : [],
    actividades: datosRaw.Activi_Siti ? 
      datosRaw.Activi_Siti.split(',').map(act => ({ label: act.trim() })) : [],
    recomendaciones: datosRaw.recomendaciones || [],
    
    // Datos adicionales
    zona: datosRaw.Nom_Zon || datosRaw.zona,
    precio: datosRaw.Precio_Hotel,
    servicios: datosRaw.Servicios_Hotel,
    categoria: datosRaw.Categoria_Hotel,
    dificultad: datosRaw.Dificultad_Siti,
    precioEntrada: datosRaw.Precio_Entra_Siti
  };

  console.log('=== DATOS TRANSFORMADOS FINALES ===');
  console.log('ID:', datosTransformados.id);
  console.log('Nombre:', datosTransformados.title);
  console.log('Tipo:', datosTransformados.tipo);
  console.log('Mostrar botón reserva:', datosTransformados.mostrarBotonReserva);
  console.log('Es reservable:', datosTransformados.esReservable);
  console.log('Objeto completo:', JSON.stringify(datosTransformados, null, 2));

  return datosTransformados;
};




const PlantillaSitio = (props) => {
  // ⭐ AGREGAR ESTOS LOGS AL INICIO
  console.log('=== PROPS RECIBIDAS EN PLANTILLA SITIO ===');
  console.log('Tipo:', props.tipo);
  console.log('Navigation disponible:', !!props.navigation);
  console.log('Props completas:', JSON.stringify(props, null, 2));

  const {
    Id_Siti,
    image,
    title,
    puntaje,
    location,
    descripcion,
    horario,
    horario_inicio,
    horario_fin,
    precios = [],
    actividades = [],
    recomendaciones = [],
    tipo = 'sitio_turistico', // ⭐ Usar el tipo de props
    tipo_habitacion,
    cantidad_personas,
    navigation
  } = props;

  // Colores hex como variables para uso en estilos inline
  const colors = {
    primary: '#101C5D',
    secondary: '#569298',
    complementary: '#D4AF37',
    neutralLight: '#F5F5F5',
    neutralDark: '#333333',
    vibrant: '#F97C7C',
  };

  const displayNombre = title || props.nombre || props.Nom_Siti || props.Nom_Hotel || props.Nom_Rest || 'No especificado';
  const displayDescripcion = descripcion || props.Descrip_Siti || props.Descrip_Hotel || props.Descrip_Rest || 'No especificado';
  const displayUbicacion = location || props.ubicacion || props.Ubi_Siti || 'No especificado';

  let displayImagenObj;
  if (image && typeof image === 'string' && image.length > 0) {
    displayImagenObj = { uri: image };
  } else if (props.imagen && typeof props.imagen === 'string' && props.imagen.length > 0) {
    displayImagenObj = { uri: props.imagen };
  } else {
    displayImagenObj = require('../../assets/default-image.png');
  }

  console.log('Tipo de lugar:', tipo);
  console.log('Horario:', horario);
  console.log('Actividades:', actividades);
  console.log('Recomendaciones:', recomendaciones);

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.neutralLight }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Imagen principal con sombra sutil */}
        <View style={{ shadowColor: colors.neutralDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 }}>
          <Image
            source={displayImagenObj}
            style={{ width: '100%', height: 310, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
            resizeMode="cover"
          />
        </View>

        {/* Contenido principal */}
        <View style={[tw`bg-white rounded-t-[25px] px-6 pt-6 pb-10 -mt-6`, { shadowColor: colors.neutralDark, shadowOpacity: 0.1, shadowRadius: 6 }]}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: colors.primary, marginBottom: 6 }}>
            {displayNombre} <Ionicons name="leaf-outline" size={20} color={colors.secondary} />
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: colors.complementary, fontWeight: '600', marginRight: 12 }}>
              ⭐ {puntaje}
            </Text>
            <Ionicons name="location-outline" size={18} color={colors.neutralDark} />
            <Text style={{ color: colors.neutralDark, marginLeft: 4, fontSize: 14 }}>
              {displayUbicacion}
            </Text>
          </View>

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
                    horario_inicio: horario_inicio,
                    horario_fin: horario_fin,
                    tipo_habitacion: tipo_habitacion,
                    cantidad_personas: cantidad_personas,
                  },
                })
              }
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>
                🏨 Reservar {tipo === 'hotel' ? 'Hotel' : 'Mesa'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Horario - mostrar para todos los tipos */}
          {horario && horario !== 'null - null' && horario !== ' - ' && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 6 }}>
                {tipo === 'hotel' ? 'Horarios de atención:' : 
                 tipo === 'restaurante' ? 'Horarios de servicio:' : 
                 'Horarios de visita:'}
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
                    Tipos de habitación disponibles:
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.neutralDark, marginBottom: 18 }}>
                    {tipo_habitacion}
                  </Text>
                </>
              )}
              {cantidad_personas && (
                <>
                  <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 6 }}>
                    Capacidad máxima:
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.neutralDark, marginBottom: 18 }}>
                    {cantidad_personas} personas
                  </Text>
                </>
              )}
            </>
          )}

          {/* Precios - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 8 }}>
                Costo de entrada:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 }}>
                {precios.length > 0 ? (
                  precios.map((p, i) => (
                    <Text
                      key={i}
                      style={{
                        backgroundColor: colors.secondary,
                        color: 'white',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 8,
                        fontWeight: '600',
                        fontSize: 13,
                      }}
                    >
                      {p}
                    </Text>
                  ))
                ) : (
                  <Text style={{ color: colors.neutralDark }}>No hay información de precios</Text>
                )}
              </View>
            </>
          )}

          {/* Actividades - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, marginBottom: 12 }}>
                Atrévete a probar estas actividades:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
                {actividades.length > 0 ? (
                  actividades.map((act, i) => (
                    <View
                      key={i}
                      style={{
                        width: 72,
                        alignItems: 'center',
                        marginRight: 16,
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
                        {act.label || 'Actividad desconocida'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: colors.neutralDark, fontStyle: 'italic' }}>
                    No hay actividades disponibles
                  </Text>
                )}
              </View>
            </>
          )}

          {/* Recomendaciones - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && (
            <>
              <Text style={{ fontWeight: '700', fontSize: 18, color: colors.primary, textAlign: 'center', marginBottom: 12 }}>
                ¡Vive una mejor experiencia, con estas recomendaciones!
              </Text>
              {recomendaciones.length > 0 ? (
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
                          shadowColor: colors.neutralDark,
                          shadowOpacity: 0.1,
                          shadowRadius: 6,
                          elevation: 4,
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
                          {item.caption || 'Sin descripción'}
                        </Text>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text style={{ color: colors.neutralDark, fontStyle: 'italic', marginBottom: 24, textAlign: 'center' }}>
                  No hay recomendaciones por el momento
                </Text>
              )}
            </>
          )}

          {/* Comentarios - solo para sitios turísticos */}
          {tipo === 'sitio_turistico' && (
            <View style={{ marginTop: 12 }}>
              <Comentario Id_Siti={Id_Siti} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export { PlantillaSitio, transformarDatosSitio };
export default PlantillaSitio;
