import React, { useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, Dimensions,  SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from './tw';
import { StatusBar } from 'react-native';



const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: '¡Tu aventura comienza aquí!',
    text: 'Descubre nuestros mejores destinos de El Salvador.',
    image: require('../assets/lnd1.jpg'),
    button: 'Siguiente',
  },
  {
    key: '2',
    title: '¡Reserva al instante y sin complicaciones!',
    text: 'Reserva restaurantes y hoteles en solo unos pasos y acumula puntos con nuestras membresías cada vez que reserves.',
    image: require('../assets/lnd2.png'),
    button: 'Siguiente',
  },
  {
    key: '3',
    title: '¡Comparte tus aventuras!',
    text: 'Inspira a otros con tus experiencias y fotos.',
    image: require('../assets/lnd3.png'),
    button: 'Siguiente',
  },
  {
    key: '4',
    title: '¡Explora tranquilo, con Tori a tu lado!',
    text: 'Consulta horarios, lugares, precios y todo con ayuda de nuestro chatbot.',
    image: require('../assets/lnd4.png'),
    button: 'Iniciar',
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('SignUp');
    }
  };

  const handleSkip = () => {
    navigation.navigate('SignUp');
  };

  return (
    
    <SafeAreaView style={tw`flex-1`}>
    <StatusBar barStyle="light-content" backgroundColor="#101C5D" />

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          
            <ImageBackground source={item.image} style={[tw`flex-1`, { width }]}  resizeMode="cover">
              <View style={tw`flex-1 justify-end items-center pb-20 bg-black/65`}>
                <Text style={tw`absolute top-5 right-4 text-white font-bold mt-8 mr-2`} onPress={handleSkip}>
                    Saltar
                </Text>
                <View style={tw`items-center`}>
                  <Text style={tw`text-white text-4xl font-bold text-center pl-5 pr-5`}>{item.title}</Text>
                  <Text style={tw`text-white text-base/10 text-center pb-10  pl-5 pr-5 `}>{item.text}</Text>
                  <TouchableOpacity 
                    style={tw`bg-primary py-2.5 px-18 rounded-full`} 
                    onPress={handleNext}
                  >
                    <Text style={tw`text-white text-base/8 font-bold `}>{item.button}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            
            </ImageBackground>
        )}
      />
    </SafeAreaView>

    

  );
}

