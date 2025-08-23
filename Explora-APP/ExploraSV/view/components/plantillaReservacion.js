import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "../tw";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { crearReserva } from "../../api/reservas";

export default function PlantillaReservacion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tipoLugar, datosLugar } = route.params;

  const [cantidadPersonas, setCantidadPersonas] = useState(2);
  const [fechaInicioDate, setFechaInicioDate] = useState(null);
  const [fechaFinDate, setFechaFinDate] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);
  const [tipoHabitacion, setTipoHabitacion] = useState("doble");
  const [loading, setLoading] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [currentPicker, setCurrentPicker] = useState(null);

  const preciosHabitacion = { sencilla: 120, doble: 180, suite: 280 };

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
  if (!horaInicio || !horaFin) return true; // Si no hay horarios definidos, permitir cualquier hora

  const hora = horaSeleccionada.getHours() * 60 + horaSeleccionada.getMinutes();
  const inicio = parseInt(horaInicio.split(':')[0]) * 60 + parseInt(horaInicio.split(':'));
  const fin = parseInt(horaFin.split(':')) * 60 + parseInt(horaFin.split(':'));

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
    
    const { horario_inicio, horario_fin } = datosLugar;
    
    if (!validarHorarioNegocio(selectedDate, horario_inicio, horario_fin)) {
      Alert.alert(
        "Hora fuera del horario de servicio",
        `El ${tipoLugar} atiende de ${horario_inicio} a ${horario_fin}. Por favor selecciona una hora dentro de este rango.`
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
  const calcularPrecios = () => {
    const precioBase = preciosHabitacion[tipoHabitacion] || 180;
    const subTotal = precioBase * cantidadPersonas;
    const costoServicio = 10;
    const total = subTotal + costoServicio;
    return { subTotal, costoServicio, total };
  };

  const { subTotal, costoServicio, total } = calcularPrecios();

  const procesarReserva = async () => {
    if (!fechaInicioDate || !fechaFinDate || !horaInicio || !horaFin) {
      Alert.alert(
        "Fechas y horas requeridas",
        "Selecciona fechas y horas de inicio y fin."
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

    const payload = {
      tipo_lugar: tipoLugar,
      id_lugar: datosLugar.id,
      fecha_reserva: formatearFechaAPI(fechaInicioDate, horaInicio),
      cantidad_personas: cantidadPersonas,
      sub_total: subTotal,
      costo_servicio: costoServicio,
      fecha_inicio: formatearFechaAPI(fechaInicioDate, horaInicio),
      fecha_fin: formatearFechaAPI(fechaFinDate, horaFin),
      tipo_habitacion: tipoLugar === "hotel" ? tipoHabitacion : null,
    };

    setLoading(true);
    try {
      const reservaCreada = await crearReserva(payload);
      Alert.alert(
        "¡Reserva Confirmada!",
        `Tu reserva ha sido creada exitosamente.\n\nLugar: ${
          datosLugar.nombre
        }\nTipo: ${tipoLugar}\nPersonas: ${cantidadPersonas}\nFechas: ${inicio.toLocaleString(
          "es-ES"
        )} - ${fin.toLocaleString("es-ES")}\nTotal: $${total.toFixed(
          2
        )}\nID: ${reservaCreada.id || "N/A"}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`px-4`}
    >
      {/* Datos del lugar */}
      <View style={tw`bg-blue-50 p-3 rounded-2xl mb-4`}>
        <Image
          source={
            datosLugar.imagen
              ? { uri: datosLugar.imagen }
              : require("../../assets/default-image.png")
          }
          style={tw`w-full h-40 rounded-xl mb-3`}
          resizeMode="cover"
        />
        <Text style={tw`text-lg font-bold text-gray-800`}>{datosLugar.nombre}</Text>
        {datosLugar.descripcion && (
          <Text style={tw`text-gray-600`}>{datosLugar.descripcion}</Text>
        )}
        {datosLugar.ubicacion && (
          <Text style={tw`text-gray-600`}>📍 {datosLugar.ubicacion}</Text>
        )}
      </View>

      {/* Cantidad Personas */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>
          Cantidad de personas
        </Text>
        <View
          style={tw`flex-row items-center justify-center bg-white rounded-xl px-4 py-3 shadow-sm`}
        >
          <TouchableOpacity
            onPress={() =>
              cantidadPersonas > 1 && setCantidadPersonas(cantidadPersonas - 1)
            }
            style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}
          >
            <Ionicons name="remove" size={16} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold mx-8 text-gray-800`}>
            {cantidadPersonas}
          </Text>
          <TouchableOpacity
            onPress={() =>
              cantidadPersonas < 10 && setCantidadPersonas(cantidadPersonas + 1)
            }
            style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fecha y Hora de Inicio */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>
          Fecha y hora de inicio
        </Text>
        
        {/* Botón para seleccionar fecha de inicio */}
        <TouchableOpacity
          style={tw`bg-white rounded-xl px-4 py-3 shadow-sm mb-2`}
          onPress={() => showDatePicker("inicio_fecha")}
        >
          <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha de inicio</Text>
          <Text style={tw`text-gray-800 font-semibold`}>
            {fechaInicioDate
              ? fechaInicioDate.toLocaleDateString("es-ES")
              : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>

        {/* Botón para seleccionar hora de inicio */}
        <TouchableOpacity
          style={tw`bg-white rounded-xl px-4 py-3 shadow-sm`}
          onPress={() => showDatePicker("inicio_hora")}
        >
          <Text style={tw`text-blue-600 text-xs font-medium`}>Hora de inicio</Text>
          <Text style={tw`text-gray-800 font-semibold`}>
            {horaInicio
              ? horaInicio.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Seleccionar hora"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fecha y Hora de Fin */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>
          Fecha y hora de fin
        </Text>
        
        {/* Botón para seleccionar fecha de fin */}
        <TouchableOpacity
          style={tw`bg-white rounded-xl px-4 py-3 shadow-sm mb-2`}
          onPress={() => showDatePicker("fin_fecha")}
        >
          <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha de fin</Text>
          <Text style={tw`text-gray-800 font-semibold`}>
            {fechaFinDate
              ? fechaFinDate.toLocaleDateString("es-ES")
              : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>

        {/* Botón para seleccionar hora de fin */}
        <TouchableOpacity
          style={tw`bg-white rounded-xl px-4 py-3 shadow-sm`}
          onPress={() => showDatePicker("fin_hora")}
        >
          <Text style={tw`text-blue-600 text-xs font-medium`}>Hora de fin</Text>
          <Text style={tw`text-gray-800 font-semibold`}>
            {horaFin
              ? horaFin.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Seleccionar hora"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tipo habitación para hotel */}
      {tipoLugar === "hotel" && (
        <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
          <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>
            Tipo de habitación
          </Text>
          <Text>{`${tipoHabitacion} - $${preciosHabitacion[tipoHabitacion]} por persona`}</Text>
        </View>
      )}

      {/* Resumen de la reserva */}
      <View style={tw`p-4 rounded-2xl bg-blue-50 mb-6`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Resumen de la reserva</Text>
        <Text>Sub Total: ${subTotal.toFixed(2)}</Text>
        <Text>Costo por servicio: ${costoServicio.toFixed(2)}</Text>
        <Text>Total: ${total.toFixed(2)}</Text>
      </View>

      {/* Botón Confirmar */}
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-xl mb-8`}
        onPress={procesarReserva}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Confirmar Reserva - ${total.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>

      {/* DateTimePicker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </ScrollView>
  );
}
