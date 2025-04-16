import React, { useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
      navigation.navigate('Index');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Index');
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <ImageBackground source={item.image} style={styles.slide} resizeMode="cover">
            <Text style={styles.skip} onPress={handleSkip}>Saltar</Text>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{item.button}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // opcional para evitar parpadeos
  },
  slide: {
    width,
    height,
    flex: 1,
  },
  skip: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 40,
    marginRight: 20,
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
