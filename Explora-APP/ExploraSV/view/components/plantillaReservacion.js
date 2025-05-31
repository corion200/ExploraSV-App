// PantallaReservacion.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";

export default function PantallaReservacion({ navigation }) {
  // Estados para manejar los datos del formulario
  const [cantidadPersonas, setCantidadPersonas] = useState(5);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoHabitacion, setTipoHabitacion] = useState("doble");
  
  // Precios base por tipo de habitación
  const preciosHabitacion = {
    sencilla: 120,
    doble: 180,
    suite: 280
  };

  // Calcular precios dinámicamente
  const calcularPrecios = () => {
    const precioBase = preciosHabitacion[tipoHabitacion] || 180;
    const subTotal = precioBase * cantidadPersonas;
    const costoServicio = 10;
    const total = subTotal + costoServicio;
    
    return { subTotal, costoServicio, total };
  };

  const { subTotal, costoServicio, total } = calcularPrecios();

  // Funciones para manejar cantidad de personas
  const aumentarPersonas = () => {
    if (cantidadPersonas < 10) {
      setCantidadPersonas(cantidadPersonas + 1);
    }
  };

  const disminuirPersonas = () => {
    if (cantidadPersonas > 1) {
      setCantidadPersonas(cantidadPersonas - 1);
    }
  };

  // Función para manejar fechas (simulada)
  const seleccionarFecha = (tipo) => {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES');
    
    if (tipo === 'inicio') {
      setFechaInicio(fechaFormateada);
    } else {
      // Fecha fin un día después
      const fechaFin = new Date(fechaActual);
      fechaFin.setDate(fechaFin.getDate() + 1);
      setFechaFin(fechaFin.toLocaleDateString('es-ES'));
    }
  };

  // Función para procesar la reserva
  const procesarReserva = () => {
    if (!fechaInicio || !fechaFin) {
      Alert.alert(
        "Fechas requeridas",
        "Por favor selecciona las fechas de inicio y fin de tu reserva."
      );
      return;
    }

    Alert.alert(
      "Reserva Confirmada",
      `¡Tu reserva ha sido procesada exitosamente!\n\n` +
      `Destino: Boca Olas\n` +
      `Personas: ${cantidadPersonas}\n` +
      `Habitación: ${tipoHabitacion}\n` +
      `Total: $${total.toFixed(2)}`,
      [
        {
          text: "OK",
          onPress: () => {
            // Aquí podrías navegar a otra pantalla
            console.log("Reserva confirmada");
          }
        }
      ]
    );
  };

  const obtenerNombreHabitacion = (tipo) => {
    const nombres = {
      sencilla: "Habitación Sencilla",
      doble: "Habitación Doble", 
      suite: "Suite Premium"
    };
    return nombres[tipo] || "Habitación Doble";
  };

  return (
    <ScrollView style={tw`flex-1 bg-white px-4 pt-6`}>
      {/* Encabezado con flecha */}
      <TouchableOpacity 
        style={tw`mb-4`}
        onPress={() => navigation && navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={tw`text-xl font-bold text-center mb-4`}>
        Detalles de la Reserva
      </Text>

      {/* Imagen y nombre */}
      <View style={tw`bg-blue-50 p-3 rounded-2xl mb-4`}>
        <Image
          source={{ uri: "https://i.imgur.com/oZgUJEW.png" }}
          style={tw`w-full h-40 rounded-xl mb-3`}
          resizeMode="cover"
        />
        <Text style={tw`text-lg font-bold text-gray-800`}>Boca Olas</Text>
        <Text style={tw`text-gray-600`}>
          📍 Playa El Tunco, El Salvador
        </Text>
      </View>

      {/* Cantidad de personas */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>
          Cantidad de personas
        </Text>
        <View style={tw`flex-row items-center justify-center bg-white rounded-xl px-4 py-3 shadow-sm`}>
          <TouchableOpacity 
            onPress={disminuirPersonas}
            style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}
          >
            <Ionicons 
              name="remove" 
              size={16} 
              color="white"
            />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold mx-8 text-gray-800`}>{cantidadPersonas}</Text>
          <TouchableOpacity 
            onPress={aumentarPersonas}
            style={tw`p-2 bg-blue-600 rounded-full w-8 h-8 items-center justify-center`}
          >
            <Ionicons 
              name="add" 
              size={16} 
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fechas */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>Fecha de Reserva</Text>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity 
            style={tw`bg-white rounded-xl px-4 py-3 w-[48%] shadow-sm border border-blue-100`}
            onPress={() => seleccionarFecha('inicio')}
          >
            <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha de inicio</Text>
            <Text style={tw`text-gray-800 font-semibold mt-1`}>
              {fechaInicio || "Seleccionar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`bg-white rounded-xl px-4 py-3 w-[48%] shadow-sm border border-blue-100`}
            onPress={() => seleccionarFecha('fin')}
          >
            <Text style={tw`text-blue-600 text-xs font-medium`}>Fecha final</Text>
            <Text style={tw`text-gray-800 font-semibold mt-1`}>
              {fechaFin || "Seleccionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tipo de habitación */}
      <View style={tw`bg-blue-50 p-4 rounded-2xl mb-4`}>
        <Text style={tw`text-base font-semibold mb-3 text-gray-800`}>Tipo de habitación</Text>
        <View style={tw`bg-white rounded-xl shadow-sm border border-blue-100`}>
          <Picker 
            selectedValue={tipoHabitacion} 
            onValueChange={(itemValue) => setTipoHabitacion(itemValue)}
            style={tw`h-12`}
          >
            <Picker.Item label="Habitación Sencilla - $120/persona" value="sencilla" />
            <Picker.Item label="Habitación Doble - $180/persona" value="doble" />
            <Picker.Item label="Suite Premium - $280/persona" value="suite" />
          </Picker>
        </View>
      </View>

      {/* Totales */}
      <View style={tw`p-4 rounded-2xl bg-blue-50 mb-6 border border-blue-100`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-base text-gray-700`}>Sub Total:</Text>
          <Text style={tw`text-base font-bold text-gray-800`}>${subTotal.toFixed(2)}</Text>
        </View>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-base text-gray-700`}>Costo por servicio:</Text>
          <Text style={tw`text-base font-bold text-gray-800`}>${costoServicio.toFixed(2)}</Text>
        </View>
        <View style={tw`border-t border-blue-200 pt-3 mt-3`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>Total:</Text>
            <Text style={tw`text-lg font-bold text-blue-600`}>${total.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Información adicional */}
        <View style={tw`mt-3 pt-3 border-t border-blue-200`}>
          <Text style={tw`text-sm text-gray-600`}>
            {obtenerNombreHabitacion(tipoHabitacion)} × {cantidadPersonas} personas
          </Text>
          {fechaInicio && fechaFin && (
            <Text style={tw`text-sm text-gray-600 mt-1`}>
              Del {fechaInicio} al {fechaFin}
            </Text>
          )}
        </View>
      </View>

      {/* Botón */}
      <TouchableOpacity 
        style={tw`bg-blue-600 py-4 rounded-xl mb-8 shadow-lg`}
        onPress={procesarReserva}
      >
        <Text style={tw`text-white text-center text-lg font-bold`}>
          Reservar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}