import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "../tw";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { crearReserva } from "../../api/reservas";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlantillaReservacion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tipoLugar, datosLugar } = route.params;

  const [cantidadPersonas, setCantidadPersonas] = useState(2);
  const [fechaInicioDate, setFechaInicioDate] = useState(null);
  const [fechaFinDate, setFechaFinDate] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHabitaciones, setLoadingHabitaciones] = useState(false);
  const [showHabitacionPicker, setShowHabitacionPicker] = useState(false);

  // Estados para datos completos con precios
  const [datosCompletos, setDatosCompletos] = useState(null);
  const [loadingDatos, setLoadingDatos] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [currentPicker, setCurrentPicker] = useState(null);

  // Función para cargar los datos del lugar (incluyendo precios)
  const cargarDatosCompletos = async () => {
    if (!datosLugar?.id) return;
    
    setLoadingDatos(true);
    try {
      const token = await AsyncStorage.getItem('token');
      let url = '';
      
      switch (tipoLugar) {
        case 'hotel':
          url = `http://192.168.1.61:8000/api/hoteles/${datosLugar.id}`;
          break;
        case 'restaurante':
          url = `http://192.168.1.61:8000/api/restaurantes/${datosLugar.id}`;
          break;
        case 'sitio_turistico':
          url = `http://192.168.1.61:8000/api/sitios/${datosLugar.id}`;
          break;
        default:
          setDatosCompletos(datosLugar);
          return;
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setDatosCompletos(data);
    } catch (error) {
      console.error('Error cargando datos completos:', error);
      // Usar datos originales si falla
      setDatosCompletos(datosLugar);
    } finally {
      setLoadingDatos(false);
    }
  };

  // Cargar habitaciones disponibles si es hotel
  useEffect(() => {
    if (tipoLugar === 'hotel' && datosLugar?.id) {
      cargarHabitacionesDisponibles();
    }
  }, [tipoLugar, datosLugar]);

  // Cargar datos completos
  useEffect(() => {
    cargarDatosCompletos();
  }, [tipoLugar, datosLugar]);

  const cargarHabitacionesDisponibles = async () => {
    setLoadingHabitaciones(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://192.168.1.61:8000/api/hoteles/${datosLugar.id}/habitaciones`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setHabitacionesDisponibles(data.habitaciones);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las habitaciones disponibles');
      }
    } catch (error) {
      console.error('Error cargando habitaciones:', error);
      Alert.alert('Error', 'Error de conexión al cargar habitaciones');
    } finally {
      setLoadingHabitaciones(false);
    }
  };

  const formatearFechaAPI = (fecha, hora) => {
    if (!fecha) return null;
    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dd = fecha.getDate().toString().padStart(2, "0");

    if (!hora) return `${yyyy}-${mm}-${dd}`;

    const hh = hora.getHours().toString().padStart(2, "0");
    const min = hora.getMinutes().toString().padStart(2, "0");

    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
  };

  const validarHorarioNegocio = (horaSeleccionada, horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return true;

    const hora = horaSeleccionada.getHours() * 60 + horaSeleccionada.getMinutes();
    const inicio = parseInt(horaInicio.split(':')[0]) * 60 + parseInt(horaInicio.split(':')[1]);
    const fin = parseInt(horaFin.split(':')[0]) * 60 + parseInt(horaFin.split(':')[1]);

    return hora >= inicio && hora <= fin;
  };

  const showDatePicker = (picker) => {
    setCurrentPicker(picker);
    setPickerMode(picker.includes("hora") ? "time" : "date");
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setCurrentPicker(null);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    if (!selectedDate) return;

    // Validación de horarios para hoteles y restaurantes
    if ((currentPicker === "inicio_hora" || currentPicker === "fin_hora") && 
        (tipoLugar === 'hotel' || tipoLugar === 'restaurante')) {
      
      const { horario_inicio, horario_fin, HoraI_Hotel, HoraF_Hotel, HoraI_Rest, HoraF_Rest } = datosCompletos || datosLugar;
      const horaInicioNegocio = horario_inicio || HoraI_Hotel || HoraI_Rest;
      const horaFinNegocio = horario_fin || HoraF_Hotel || HoraF_Rest;
      
      if (!validarHorarioNegocio(selectedDate, horaInicioNegocio, horaFinNegocio)) {
        Alert.alert(
          "Hora fuera del horario de servicio",
          `El ${tipoLugar} atiende de ${horaInicioNegocio} a ${horaFinNegocio}. Por favor selecciona una hora dentro de este rango.`
        );
        return;
      }
    }

    switch (currentPicker) {
      case "inicio_fecha":
        setFechaInicioDate(selectedDate);
        if (fechaFinDate && selectedDate > fechaFinDate) setFechaFinDate(null);
        break;
      case "fin_fecha":
        if (fechaInicioDate && selectedDate < fechaInicioDate) {
          Alert.alert(
            "Fecha inválida",
            "La fecha final no puede ser anterior a la fecha inicial."
          );
          return;
        }
        setFechaFinDate(selectedDate);
        break;
      case "inicio_hora":
        setHoraInicio(selectedDate);
        break;
      case "fin_hora":
        setHoraFin(selectedDate);
        break;
      default:
        break;
    }
  };

  // Función para calcular número de noches
  const calcularNoches = () => {
    if (!fechaInicioDate || !fechaFinDate) return 0;
    
    const inicio = new Date(fechaInicioDate);
    const fin = new Date(fechaFinDate);
    const diferenciaTiempo = fin.getTime() - inicio.getTime();
    const noches = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    
    return noches > 0 ? noches : 0;
  };

  // Función de cálculo de precios con datos de la BD
  const calcularPrecios = () => {
    let precioPorNoche = 50; // Precio base por defecto
    const noches = calcularNoches();
    const datos = datosCompletos || datosLugar;
    
    if (tipoLugar === 'hotel' && habitacionSeleccionada) {
      // Usar el precio por noche de la habitación seleccionada
      const habitacion = habitacionesDisponibles.find(h => h.id === habitacionSeleccionada);
      precioPorNoche = habitacion ? parseFloat(habitacion.costo) : 50;
    } else if (tipoLugar === 'restaurante') {
      // NUEVO: Usar precio de la base de datos multiplicado por personas
      const precioRestaurante = datos.Precio_Rest || datos.precio || 25;
      precioPorNoche = parseFloat(precioRestaurante) * cantidadPersonas;
    } else if (tipoLugar === 'sitio_turistico') {
      // Usar precio de la base de datos multiplicado por personas
      const precioSitio = datos.Precio_Siti || datos.precio || 15;
      precioPorNoche = parseFloat(precioSitio) * cantidadPersonas;
    }
    
    // Para hoteles: multiplicar por número de noches
    // Para restaurantes: precio ya calculado con personas
    const subTotal = tipoLugar === 'hotel' ? precioPorNoche * noches : precioPorNoche;
    const costoServicio = 10;
    const total = subTotal + costoServicio;
    
    return { subTotal, costoServicio, total, precioPorNoche, noches };
  };

  const { subTotal, costoServicio, total, precioPorNoche, noches } = calcularPrecios();

  // Función procesarReserva con navegación
  const procesarReserva = async () => {
    if (!fechaInicioDate || !fechaFinDate || !horaInicio || !horaFin) {
      Alert.alert(
        "Fechas y horas requeridas",
        "Selecciona fechas y horas de inicio y fin."
      );
      return;
    }

    if (tipoLugar === 'hotel' && !habitacionSeleccionada) {
      Alert.alert(
        "Habitación requerida",
        "Selecciona una habitación para tu reserva."
      );
      return;
    }

    if (tipoLugar === 'hotel' && noches === 0) {
      Alert.alert(
        "Noches requeridas",
        "Debe haber al menos una noche de diferencia entre las fechas."
      );
      return;
    }

    if (!tipoLugar || !datosLugar?.id) {
      Alert.alert("Error", "Faltan datos del lugar.");
      return;
    }

    const inicio = new Date(
      fechaInicioDate.getFullYear(),
      fechaInicioDate.getMonth(),
      fechaInicioDate.getDate(),
      horaInicio.getHours(),
      horaInicio.getMinutes()
    );
    const fin = new Date(
      fechaFinDate.getFullYear(),
      fechaFinDate.getMonth(),
      fechaFinDate.getDate(),
      horaFin.getHours(),
      horaFin.getMinutes()
    );
    
    if (inicio >= fin) {
      Alert.alert(
        "Error en horarios",
        "La fecha y hora de inicio deben ser anteriores a la fecha y hora final."
      );
      return;
    }

    const habitacionSeleccionadaData = habitacionesDisponibles.find(h => h.id === habitacionSeleccionada);

    // PAYLOAD ACTUALIZADO para coincidir exactamente con la API de Laravel
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      const payload = {
        tipo_lugar: tipoLugar,
        id_lugar: datosLugar.id,
        fecha_reserva: formatearFechaAPI(fechaInicioDate, horaInicio),
        cantidad_personas: cantidadPersonas,
        sub_total: subTotal,
        costo_servicio: costoServicio,
        fecha_inicio: formatearFechaAPI(fechaInicioDate, horaInicio),
        fecha_fin: formatearFechaAPI(fechaFinDate, horaFin),
        // Campos específicos para hoteles
        ...(tipoLugar === "hotel" && {
          tipo_habitacion: habitacionSeleccionadaData?.tipo,
          id_habitacion: habitacionSeleccionada,
        }),
        // IMPORTANTE: Id_Cli5 requerido por el controlador Laravel
        Id_Cli5: userId,
      };

      setLoading(true);
      
      const reservaCreada = await crearReserva(payload);
      
      const habitacionInfo = habitacionSeleccionadaData 
        ? `\nHabitación: ${habitacionSeleccionadaData.numero} (${habitacionSeleccionadaData.tipo})`
        : '';
      const nochesInfo = tipoLugar === 'hotel' ? `\nNoches: ${noches}` : '';
      
      Alert.alert(
        "¡Reserva Confirmada!",
        `Tu reserva ha sido creada exitosamente.\n\nLugar: ${
          datosLugar.nombre || datosLugar.Nom_Hotel || datosLugar.Nom_Rest || datosLugar.Nom_Siti
        }\nTipo: ${tipoLugar}${habitacionInfo}${nochesInfo}\nPersonas: ${cantidadPersonas}\nFechas: ${inicio.toLocaleString(
          "es-ES"
        )} - ${fin.toLocaleString("es-ES")}\nTotal: $${total.toFixed(
          2
        )}\nID: ${reservaCreada.id || reservaCreada.reserva?.Id_Rese || "N/A"}`,
        [{ 
          text: "OK", 
          onPress: () => navigation.navigate("Payment", {
            reservaData: {
              id: reservaCreada.id || reservaCreada.reserva?.Id_Rese,
              total: total,
              subTotal: subTotal,
              costoServicio: costoServicio,
              lugar: {
                nombre: datosLugar.nombre || datosLugar.Nom_Hotel || datosLugar.Nom_Rest || datosLugar.Nom_Siti,
                tipo: tipoLugar
              },
              personas: cantidadPersonas,
              fechas: {
                inicio: inicio.toLocaleString("es-ES"),
                fin: fin.toLocaleString("es-ES")
              },
              habitacion: habitacionSeleccionadaData ? {
                numero: habitacionSeleccionadaData.numero,
                tipo: habitacionSeleccionadaData.tipo,
                costo: habitacionSeleccionadaData.costo
              } : null,
              noches: noches
            }
          })
        }]
      );
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert("Error", error.message || "No se pudo crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  const renderHabitacionItem = ({ item }) => (
    <TouchableOpacity
      style={tw`bg-white p-5 rounded-2xl mb-4 border-2 shadow-lg ${
        habitacionSeleccionada === item.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#569298]/20'
      }`}
      onPress={() => {
        setHabitacionSeleccionada(item.id);
        setShowHabitacionPicker(false);
      }}
    >
      <View style={tw`flex-row justify-between items-start`}>
        <View style={tw`flex-1 pr-4`}>
          <View style={tw`flex-row items-center mb-3`}>
            <Text style={tw`text-xl font-bold text-[#101C5D]`}>
              Habitación {item.numero}
            </Text>
            {habitacionSeleccionada === item.id && (
              <Ionicons name="checkmark-circle" size={24} color="#D4AF37" style={tw`ml-3`} />
            )}
          </View>
          <View style={tw`bg-[#569298] px-4 py-2 rounded-full self-start mb-3`}>
            <Text style={tw`text-white font-semibold text-sm`}>{item.tipo}</Text>
          </View>
          <Text style={tw`text-[#333333] text-base leading-6`}>{item.descripcion}</Text>
        </View>
        <View style={tw`items-end`}>
          <Text style={tw`text-3xl font-bold text-[#D4AF37]`}>
            ${item.costo}
          </Text>
          <Text style={tw`text-[#569298] text-sm font-medium`}>por noche</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const habitacionSeleccionadaData = habitacionesDisponibles.find(h => h.id === habitacionSeleccionada);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F5F5F5]`}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#101C5D', '#569298']}
        style={tw`px-6 py-4 rounded-b-3xl`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`bg-white/20 p-3 rounded-xl`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-xl font-bold flex-1 text-center mx-4`}>
            Reservar {tipoLugar === 'hotel' ? 'Hotel' : tipoLugar === 'restaurante' ? 'Restaurante' : 'Sitio'}
          </Text>
          <View style={tw`w-12`} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pb-8`}
      >
        {/* Tarjeta principal del lugar */}
        <View style={tw`bg-white rounded-3xl p-5 mb-6 shadow-lg -mt-4 mx-2`}>
          <Image
            source={
              datosLugar.imagen
                ? { uri: datosLugar.imagen }
                : require("../../assets/default-image.png")
            }
            style={tw`w-full h-48 rounded-2xl mb-4`}
            resizeMode="cover"
          />
          
          <Text style={tw`text-2xl font-bold text-[#101C5D] mb-2`}>
            {datosLugar.nombre || datosLugar.Nom_Hotel || datosLugar.Nom_Rest || datosLugar.Nom_Siti}
          </Text>
          
          {(datosLugar.descripcion || datosLugar.Descrip_Hotel || datosLugar.Descrip_Rest || datosLugar.Descrip_Siti) && (
            <Text style={tw`text-[#333333] text-base leading-6 mb-3`}>
              {datosLugar.descripcion || datosLugar.Descrip_Hotel || datosLugar.Descrip_Rest || datosLugar.Descrip_Siti}
            </Text>
          )}
          
          <View style={tw`flex-row items-center justify-between`}>
            {datosLugar.ubicacion && (
              <View style={tw`flex-row items-center`}>
                <Ionicons name="location" size={18} color="#569298" />
                <Text style={tw`text-[#569298] ml-2 font-medium`}>{datosLugar.ubicacion}</Text>
              </View>
            )}
            
            {(datosLugar.capacidad_maxima || datosLugar.Capa_MaxH || datosLugar.Capa_MaxR) && (
              <View style={tw`flex-row items-center`}>
                <Ionicons name="people" size={18} color="#D4AF37" />
                <Text style={tw`text-[#D4AF37] ml-2 font-semibold`}>
                  Capacidad: {datosLugar.capacidad_maxima || datosLugar.Capa_MaxH || datosLugar.Capa_MaxR}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ACTUALIZADO: Información de huéspedes */}
        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md`}>
          <Text style={tw`text-lg font-bold text-[#101C5D] mb-4`}>
            <Ionicons name="people-outline" size={20} color="#101C5D" /> Información de huéspedes
          </Text>
          <Text style={tw`text-[#569298] text-sm mb-4`}>
            {tipoLugar === 'hotel' 
              ? 'Esta información es solo informativa. El precio se calcula por habitación y número de noches.'
              : tipoLugar === 'restaurante'
              ? 'El precio se calcula por persona. Selecciona el número de comensales.'
              : 'El precio se calcula por persona. Selecciona el número de visitantes.'
            }
          </Text>
          
          <View style={tw`bg-[#F5F5F5] rounded-2xl px-6 py-4`}>
            <View style={tw`flex-row items-center justify-between`}>
              <TouchableOpacity
                onPress={() => cantidadPersonas > 1 && setCantidadPersonas(cantidadPersonas - 1)}
                style={tw`bg-[#569298] p-3 rounded-xl ${cantidadPersonas <= 1 ? 'opacity-50' : ''}`}
                disabled={cantidadPersonas <= 1}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              
              <View style={tw`items-center`}>
                <Text style={tw`text-3xl font-bold text-[#101C5D]`}>{cantidadPersonas}</Text>
                <Text style={tw`text-[#333333] text-sm`}>
                  {tipoLugar === 'restaurante' 
                    ? (cantidadPersonas === 1 ? 'comensal' : 'comensales')
                    : tipoLugar === 'sitio_turistico'
                    ? (cantidadPersonas === 1 ? 'visitante' : 'visitantes')
                    : (cantidadPersonas === 1 ? 'persona' : 'personas')
                  }
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => setCantidadPersonas(cantidadPersonas + 1)}
                style={tw`bg-[#569298] p-3 rounded-xl`}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Fechas y horas con indicador de noches */}
        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-lg font-bold text-[#101C5D]`}>
              <Ionicons name="calendar-outline" size={20} color="#101C5D" /> Fechas y horarios
            </Text>
            {/* Mostrar número de noches calculado */}
            {tipoLugar === 'hotel' && noches > 0 && (
              <View style={tw`bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30`}>
                <Text style={tw`text-[#D4AF37] font-bold text-sm`}>
                  {noches} {noches === 1 ? 'noche' : 'noches'}
                </Text>
              </View>
            )}
          </View>
          
          {/* Fecha y hora de inicio */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-[#333333] font-semibold mb-3`}>Inicio de la reserva</Text>
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-[#F5F5F5] rounded-xl p-4 border border-[#569298]/30`}
                onPress={() => showDatePicker("inicio_fecha")}
              >
                <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Fecha</Text>
                <Text style={tw`text-[#333333] font-semibold`}>
                  {fechaInicioDate ? fechaInicioDate.toLocaleDateString("es-ES") : "Seleccionar"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`flex-1 bg-[#F5F5F5] rounded-xl p-4 border border-[#569298]/30`}
                onPress={() => showDatePicker("inicio_hora")}
              >
                <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Hora</Text>
                <Text style={tw`text-[#333333] font-semibold`}>
                  {horaInicio ? horaInicio.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "Seleccionar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Fecha y hora de fin */}
          <View>
            <Text style={tw`text-[#333333] font-semibold mb-3`}>Fin de la reserva</Text>
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-[#F5F5F5] rounded-xl p-4 border border-[#569298]/30`}
                onPress={() => showDatePicker("fin_fecha")}
              >
                <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Fecha</Text>
                <Text style={tw`text-[#333333] font-semibold`}>
                  {fechaFinDate ? fechaFinDate.toLocaleDateString("es-ES") : "Seleccionar"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`flex-1 bg-[#F5F5F5] rounded-xl p-4 border border-[#569298]/30`}
                onPress={() => showDatePicker("fin_hora")}
              >
                <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Hora</Text>
                <Text style={tw`text-[#333333] font-semibold`}>
                  {horaFin ? horaFin.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "Seleccionar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Selección de habitación para hoteles */}
        {tipoLugar === "hotel" && (
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md`}>
            <Text style={tw`text-lg font-bold text-[#101C5D] mb-4`}>
              <Ionicons name="bed-outline" size={20} color="#101C5D" /> Seleccionar habitación
            </Text>
            
            {loadingHabitaciones ? (
              <View style={tw`bg-[#F5F5F5] rounded-xl p-8 items-center`}>
                <ActivityIndicator size="large" color="#569298" />
                <Text style={tw`text-[#333333] mt-3 font-medium`}>Cargando habitaciones...</Text>
              </View>
            ) : habitacionesDisponibles.length > 0 ? (
              <TouchableOpacity
                style={tw`bg-[#F5F5F5] rounded-xl p-4 border-2 ${
                  habitacionSeleccionadaData ? 'border-[#D4AF37]' : 'border-[#569298]/30'
                }`}
                onPress={() => setShowHabitacionPicker(true)}
              >
                <View style={tw`flex-row justify-between items-center`}>
                  <View style={tw`flex-1`}>
                    {habitacionSeleccionadaData ? (
                      <View>
                        <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Habitación seleccionada</Text>
                        <Text style={tw`text-[#101C5D] font-bold text-lg`}>
                          Habitación {habitacionSeleccionadaData.numero}
                        </Text>
                        <Text style={tw`text-[#333333] font-medium`}>
                          {habitacionSeleccionadaData.tipo} • ${habitacionSeleccionadaData.costo}/noche
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={tw`text-[#569298] text-xs font-medium mb-1`}>Habitación</Text>
                        <Text style={tw`text-[#333333] font-semibold text-lg`}>Seleccionar habitación</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-down" size={24} color="#569298" />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={tw`bg-[#F97C7C]/10 rounded-xl p-8 items-center border border-[#F97C7C]/30`}>
                <Ionicons name="alert-circle-outline" size={48} color="#F97C7C" />
                <Text style={tw`text-[#333333] mt-3 text-center font-medium`}>
                  No hay habitaciones disponibles para este hotel
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ACTUALIZADO: Resumen de la reserva */}
        <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-md`}>
          <Text style={tw`text-lg font-bold text-[#101C5D] mb-4`}>
            <Ionicons name="receipt-outline" size={20} color="#101C5D" /> Resumen de la reserva
          </Text>
          
          <View style={tw`space-y-3`}>
            {/* Mostrar desglose para hoteles */}
            {tipoLugar === 'hotel' && habitacionSeleccionadaData && noches > 0 && (
              <>
                <View style={tw`flex-row justify-between items-center pb-3 border-b border-[#F5F5F5]`}>
                  <Text style={tw`text-[#333333] font-medium`}>Habitación {habitacionSeleccionadaData.numero}</Text>
                  <Text style={tw`font-bold text-[#101C5D]`}>${habitacionSeleccionadaData.costo}/noche</Text>
                </View>
                <View style={tw`flex-row justify-between items-center pb-3 border-b border-[#F5F5F5]`}>
                  <Text style={tw`text-[#333333] font-medium`}>
                    {noches} {noches === 1 ? 'noche' : 'noches'} × ${precioPorNoche}
                  </Text>
                  <Text style={tw`font-bold text-[#101C5D]`}>${(precioPorNoche * noches).toFixed(2)}</Text>
                </View>
              </>
            )}

            {/* Mostrar desglose para restaurantes */}
            {tipoLugar === 'restaurante' && (
              <View style={tw`flex-row justify-between items-center pb-3 border-b border-[#F5F5F5]`}>
                <Text style={tw`text-[#333333] font-medium`}>
                  {cantidadPersonas} {cantidadPersonas === 1 ? 'comensal' : 'comensales'} × ${(datosCompletos?.Precio_Rest || datosLugar.Precio_Rest || 25)}
                </Text>
                <Text style={tw`font-bold text-[#101C5D]`}>${precioPorNoche.toFixed(2)}</Text>
              </View>
            )}

            {/* Mostrar desglose para sitios turísticos */}
            {tipoLugar === 'sitio_turistico' && (
              <View style={tw`flex-row justify-between items-center pb-3 border-b border-[#F5F5F5]`}>
                <Text style={tw`text-[#333333] font-medium`}>
                  {cantidadPersonas} {cantidadPersonas === 1 ? 'visitante' : 'visitantes'} × ${(datosCompletos?.Precio_Siti || datosLugar.Precio_Siti || 15)}
                </Text>
                <Text style={tw`font-bold text-[#101C5D]`}>${precioPorNoche.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-[#333333] font-medium`}>
                {tipoLugar === 'hotel' ? 'Subtotal estancia' : 'Subtotal'}
              </Text>
              <Text style={tw`font-bold text-[#101C5D]`}>${subTotal.toFixed(2)}</Text>
            </View>
            
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-[#333333] font-medium`}>Costo por servicio</Text>
              <Text style={tw`font-bold text-[#101C5D]`}>${costoServicio.toFixed(2)}</Text>
            </View>
            
            <View style={tw`bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-xl font-bold text-[#101C5D]`}>Total a pagar</Text>
                <Text style={tw`text-2xl font-bold text-[#D4AF37]`}>${total.toFixed(2)}</Text>
              </View>
            </View>
            
            <Text style={tw`text-[#569298] text-sm text-center mt-2`}>
              {tipoLugar === 'hotel' 
                ? '💡 Precio calculado por habitación y número de noches' 
                : '💡 Precio calculado por persona'
              }
            </Text>
          </View>
        </View>

        {/* Botón de confirmación ACTUALIZADO */}
        <LinearGradient
          colors={['#D4AF37', '#B8941F']}
          style={tw`rounded-2xl mb-8 ${
            (tipoLugar === 'hotel' && (!habitacionSeleccionada || noches === 0)) ? 'opacity-50' : ''
          }`}
        >
          <TouchableOpacity
            style={tw`py-5 px-6`}
            onPress={procesarReserva}
            disabled={loading || (tipoLugar === 'hotel' && (!habitacionSeleccionada || noches === 0))}
          >
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <View style={tw`flex-row items-center justify-center`}>
                <Ionicons name="checkmark-circle" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white text-xl font-bold`}>
                  {tipoLugar === 'hotel' && !habitacionSeleccionada
                    ? 'Selecciona una Habitación'
                    : tipoLugar === 'hotel' && noches === 0
                    ? 'Selecciona fechas válidas'
                    : `Confirmar Reserva • $${total.toFixed(2)}`
                  }
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* Modal para seleccionar habitación */}
      <Modal
        visible={showHabitacionPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHabitacionPicker(false)}
      >
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-6 max-h-120`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-[#101C5D]`}>
                Habitaciones Disponibles
              </Text>
              <TouchableOpacity 
                onPress={() => setShowHabitacionPicker(false)}
                style={tw`bg-[#F5F5F5] p-2 rounded-xl`}
              >
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={habitacionesDisponibles}
              renderItem={renderHabitacionItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={tw`max-h-96`}
            />
          </View>
        </View>
      </Modal>

      {/* DateTimePicker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </SafeAreaView>
  );
}
