// components/PlantillaReservacion.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "../tw";
import { crearReserva } from "../../api/reservas";

export default function PlantillaReservacion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tipoLugar, datosLugar } = route.params;

  const [cantidadPersonas, setCantidadPersonas] = useState(2);
  const [fechaInicioDate, setFechaInicioDate] = useState(null);
  const [fechaFinDate, setFechaFinDate] = useState(null);
  const [tipoHabitacion, setTipoHabitacion] = useState("doble");
  const [loading, setLoading] = useState(false);

  const preciosHabitacion = { sencilla: 120, doble: 180, suite: 280 };

  const calcularPrecios = () => {
    const precioBase = preciosHabitacion[tipoHabitacion] || 180;
    const subTotal = precioBase * cantidadPersonas;
    const costoServicio = 10;
    const total = subTotal + costoServicio;
    return { subTotal, costoServicio, total };
  };

  const { subTotal, costoServicio, total } = calcularPrecios();

  const formatearFechaAPI = (fecha) => {
    if (!fecha) return null;
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  };

  const aumentarPersonas = () => cantidadPersonas < 10 && setCantidadPersonas(cantidadPersonas + 1);
  const disminuirPersonas = () => cantidadPersonas > 1 && setCantidadPersonas(cantidadPersonas - 1);

  const seleccionarFecha = (tipo) => {
    const fechaActual = new Date();
    if (tipo === 'inicio') {
      setFechaInicioDate(fechaActual);
      const fechaFin = new Date(fechaActual);
      fechaFin.setDate(fechaFin.getDate() + 1);
      setFechaFinDate(fechaFin);
    } else {
      const fechaFin = new Date(fechaActual);
      fechaFin.setDate(fechaFin.getDate() + 2);
      setFechaFinDate(fechaFin);
    }
  };

  const procesarReserva = async () => {
    if (!fechaInicioDate || !fechaFinDate) {
      Alert.alert("Fechas requeridas", "Selecciona fechas de inicio y fin.");
      return;
    }
    if (!tipoLugar || !datosLugar?.id) {
      Alert.alert("Error", "Faltan datos del lugar.");
      return;
    }

    const payload = {
    tipo_lugar: tipoLugar,
    id_lugar: datosLugar.id,
    fecha_reserva: formatearFechaAPI(fechaInicioDate),
    cantidad_personas: cantidadPersonas,
    sub_total: subTotal,
    costo_servicio: costoServicio,
    fecha_inicio: formatearFechaAPI(fechaInicioDate),
    fecha_fin: formatearFechaAPI(fechaFinDate),
    tipo_habitacion: tipoLugar === 'hotel' ? tipoHabitacion : null,
    };



    setLoading(true);
    try {
      const reservaCreada = await crearReserva(payload);
      Alert.alert(
        "¡Reserva Confirmada!",
        `Tu reserva ha sido creada exitosamente.\n\nLugar: ${datosLugar.nombre}\nTipo: ${tipoLugar}\nPersonas: ${cantidadPersonas}\nFechas: ${fechaInicioDate.toLocaleDateString('es-ES')} - ${fechaFinDate.toLocaleDateString('es-ES')}\nTotal: $${total.toFixed(2)}\nID: ${reservaCreada.id || 'N/A'}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-4`}>
      {/* Datos del lugar */}
      <View style={tw`bg-blue-50 p-3 rounded-2xl mb-4`}>
        <Image
          source={datosLugar.imagen ? { uri: datosLugar.imagen } : require("../../assets/default-image.png")}
          style={tw`w-full h-40 rounded-xl mb-3`}
          resizeMode="cover"
        />
        <Text style={tw`text-lg font-bold text-gray-800`}>{datosLugar.nombre}</Text>
        {datosLugar.descripcion && <Text style={tw`text-gray-600`}>{datosLugar.descripcion}</Text>}
        {datosLugar.ubicacion && <Text style={tw`text-gray-600`}>📍 {datosLugar.ubicacion}</Text>}
      </View>

      {/* Cantidad Personas */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>Cantidad de personas</Text>
        <View style={tw`flex-row items-center justify-center bg-white rounded-xl px-4 py-3 shadow-sm`}>
          <TouchableOpacity onPress={disminuirPersonas} style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}>
            <Ionicons name="remove" size={16} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold mx-8 text-gray-800`}>{cantidadPersonas}</Text>
          <TouchableOpacity onPress={aumentarPersonas} style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fechas */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>Fechas de reserva</Text>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity style={tw`bg-white rounded-xl px-4 py-3 w-[48%] shadow-sm`} onPress={() => seleccionarFecha('inicio')}>
            <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha de inicio</Text>
            <Text style={tw`text-gray-800 font-semibold mt-1`}>
              {fechaInicioDate ? fechaInicioDate.toLocaleDateString('es-ES') : "Seleccionar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`bg-white rounded-xl px-4 py-3 w-[48%] shadow-sm`} onPress={() => seleccionarFecha('fin')}>
            <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha final</Text>
            <Text style={tw`text-gray-800 font-semibold mt-1`}>
              {fechaFinDate ? fechaFinDate.toLocaleDateString('es-ES') : "Seleccionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tipo habitación */}
      {tipoLugar === "hotel" && (
        <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
          <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>Tipo de habitación</Text>
          <Text>{`${tipoHabitacion} - $${preciosHabitacion[tipoHabitacion]} por persona`}</Text>
        </View>
      )}

      {/* Resumen */}
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
    </ScrollView>
  );
}
