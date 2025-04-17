import React, { useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from './tw';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: '¡Tu aventura comienza aquí!',
    text: 'Descubre nuestros mejores destinos de El Salvador',
    image: require('../assets/fondo.jpg'),
    button: 'Siguiente',
  },
  {
    key: '2',
    title: '¡Reserva al instante y sin complicaciones!',
    text: 'Reserva restaurantes y hoteles en tan solo unos pasos',
    image: require('../assets/fondo2.png'),
    button: 'Siguiente',
  },
  {
    key: '3',
    title: '¡Comparte tus aventuras!',
    text: 'Inspira a otros con tus experiencias y fotos',
    image: require('../assets/fondo3.png'),
    button: 'Siguiente',
  },
  {
    key: '4',
    title: '¡Explora tranquilo, con Tori a tu lado!',
    text: 'Consulta horarios, lugares, precios y todo con ayuda de nuestro chatbot',
    image: require('../assets/fondo4.jpg'),
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
    navigation.navigate('Index');
  };

  return (
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
          <View style={tw`flex-1 justify-center items-center bg-black/40`}>
            <Text style={tw`absolute top-5 right-4 text-white font-bold mt-10 mr-2`} onPress={handleSkip}>
                Saltar
            </Text>
            <View style={tw`items-center`}>
              <Text style={tw`text-white text-4xl font-bold text-center p-5`}>{item.title}</Text>
              <Text style={tw`text-white text-base/10 text-center p-5`}>{item.text}</Text>
              <TouchableOpacity 
                style={tw`bg-primary py-2.5 px-8 rounded-full`} 
                onPress={handleNext}
              >
                <Text style={tw`text-black text-base/8 font-bold `}>{item.button}</Text>
              </TouchableOpacity>
            </View>
          </View>
         
        </ImageBackground>
      )}
    />
  );
}

