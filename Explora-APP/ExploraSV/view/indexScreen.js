import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';

const IndexScreen = ({ isAuthenticated }) => {
    const [userName, setUserName] = useState("Invitado");

    useEffect(() => {
        if (isAuthenticated) {
            setUserName("Juan Pérez");
        }
    }, [isAuthenticated]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hola, {userName}!</Text>
                    <Text style={styles.subGreeting}>
                        {isAuthenticated ? "¿Qué aventura nos espera hoy?" : "Bienvenido, por favor inicia sesión o regístrate"}
                    </Text>
                    <View style={styles.avatarPlaceholder}></View>
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>{isAuthenticated ? "Reserva Ahora" : "Inicia sesión para reservar"}</Text>
                    <Text style={styles.bannerSubText}>
                        {isAuthenticated
                            ? "Recibe una recompensa al hacer tu reserva con nosotros"
                            : "Accede a nuestra plataforma para ver las opciones de reserva"}
                    </Text>
                    <TouchableOpacity style={styles.bannerButton} onPress={() => alert('Redirigiendo...')}>
                        <Text style={styles.bannerButtonText}>{isAuthenticated ? "Reservar" : "Iniciar sesión"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Categorías */}
                <Text style={styles.sectionTitle}>Explora por categorías:</Text>
                <View style={styles.categories}>
                    {['Senderismo', 'Playas', 'Eco Turismo', 'Aventura'].map((category, index) => (
                        <TouchableOpacity key={index} style={styles.category} onPress={() => alert(`Explorando ${category}`)}>
                            <View style={styles.iconPlaceholder}></View>
                            <Text style={styles.categoryText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Lugares */}
                <Text style={styles.sectionTitle}>Lugares que no te puedes perder:</Text>
                <View style={styles.places}>
                    {[{ name: 'Volcán de Izalco', location: 'Departamento de Sonsonate, El Salvador' }].map((place, index) => (
                        <View key={index} style={styles.placeCard}>
                            <View style={styles.imagePlaceholder}></View>
                            <View style={styles.placeInfo}>
                                <Text style={styles.placeName}>{place.name}</Text>
                                <Text style={styles.placeLocation}>{place.location}</Text>
                            </View>
                            <TouchableOpacity style={styles.favoriteButton}>
                                <View style={styles.iconPlaceholder}></View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 16,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subGreeting: {
        fontSize: 14,
        color: '#666',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#ddd',
        borderRadius: 20,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    banner: {
        backgroundColor: '#0055FF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    bannerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    bannerSubText: {
        fontSize: 14,
        color: '#fff',
        marginVertical: 8,
    },
    bannerButton: {
        backgroundColor: '#FFD700',
        padding: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    category: {
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#ddd',
        borderRadius: 20,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        textAlign: 'center',
    },
    places: {
        marginBottom: 16,
    },
    placeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 8,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#ddd',
        borderRadius: 8,
        marginRight: 8,
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    placeLocation: {
        fontSize: 12,
        color: '#666',
    },
    favoriteButton: {
        padding: 8,
    },
});

export default IndexScreen;
