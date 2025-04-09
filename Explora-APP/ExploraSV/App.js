import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.landing}>
        <Image
          source={{ uri: 'https://example.com/turismo-banner.jpg' }}
          style={styles.banner}
        />
        <Text style={styles.title}>Bienvenido a ExploraSV</Text>
        <Text style={styles.subtitle}>Descubre los mejores destinos turísticos de El Salvador</Text>
        <Text style={styles.description}>
          Explora playas, montañas, pueblos y mucho más con nuestra app. ¡Tu aventura comienza aquí!
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Comienza a Explorar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landing: {
    alignItems: 'center',
    padding: 20,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
