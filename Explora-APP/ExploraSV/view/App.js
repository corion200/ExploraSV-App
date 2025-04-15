import React, { useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

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
    image: require('../assets/fondo.jpg'),
    button: 'Siguiente',
  },
  {
    key: '3',
    title: '¡Comparte tus aventuras!',
    text: 'Inspira a otros con tus experiencias y fotos',
    image: require('../assets/fondo.jpg'),
    button: 'Siguiente',
  },
  {
    key: '4',
    title: '¡Explora tranquilo, con Tori a tu lado!',
    text: 'Consulta horarios,  lugares, precios y todo con ayuda de nuestro chatbot',
    image: require('../assets/fondo.jpg'),
    button: 'Iniciar',
  },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      alert('¡Listo para explorar!');
    }
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
        <ImageBackground source={item.image} style={styles.slide}>
          <Text style={styles.skip}>Saltar</Text>
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
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height: height,
    justifyContent: 'space-between',
    padding: 30,
  },
  skip: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 40,
    marginRight: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
