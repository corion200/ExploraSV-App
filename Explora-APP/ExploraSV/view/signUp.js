import React from 'react';
import { View, Text,ImageBackground, TextInput, Image, SafeAreaView,TouchableOpacity,  } from 'react-native';
import tw from './tw';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const SignUp = () => {
    return (
        
        <ImageBackground source={require('../assets/fondoSU.png')}  style={tw`flex-1 `}>
            <View style={tw`flex-1 justify-center items-center bg-black/40`}>
                <View style={tw`absolute bottom-0 w-full h-6/8 bg-white rounded-t-[50px] p-5`}>
                    <View style={tw` items-center -mt-30`} >
                        <Image source={require('../assets/Favicon25.png')} style={tw`w-43 h-37 `} />
                    </View>
                    {/* Nombre */}
                    <View style={tw`flex-row items-center mb-3`}>
                        <Feather name="user" size={24} color="black" style={tw`mr-2`} />
                        <Text style={tw`text-base`}>Nombre Completo</Text>
                    </View>
                        <TextInput placeholder="Nombre completo" style={tw`border border-gray-300 rounded-xl p-3 text-base`}  
                        placeholderTextColor="#aaa"/>
                        
                    {/* correo */}
                    <View style={tw`flex-row items-center mb-3 mt-10`}>
                        <MaterialCommunityIcons name="gmail" size={24} color="black" style={tw`mr-2`} />
                        <Text style={tw`text-base`}>Correo Electronico</Text>
                    </View>
                        <TextInput placeholder="Ejemplo@gmail.com" style={tw`border border-gray-300 rounded-xl p-3 text-base`}  
                        placeholderTextColor="#aaa"/>
                    {/* Contraseña */}
                    <View style={tw`flex-row items-center mb-3 mt-10`}>
                        <AntDesign name="lock1" size={24} color="black" style={tw`mr-2`} />
                        <Text style={tw`text-base`}>Contraseña</Text>
                    </View>
                        <TextInput  secureTextEntry placeholder="Contraseña" style={tw`border border-gray-300 rounded-xl p-3 text-base`}  
                        placeholderTextColor="#aaa"/>
              
                </View>
                <View style={tw` top-60`}>
                    <TouchableOpacity style={tw`bg-primary py-2.5 px-25 rounded-full`}>
                        <Text style={tw`text-black text-base/8 font-bold `}>Registrar</Text>
                    </TouchableOpacity>
                </View>
              
            </View>
      </ImageBackground>

    )
}
export default SignUp;

