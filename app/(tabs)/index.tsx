//import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { getCharacters } from '../../services/api';

export default function HomeScreen() {
  const { state } = useFavorites();
  const [totalApi, setTotalApi] = useState(0);

  //Queda sin uso al eliminar la sección de 'Accesos Rápidos', pero lo dejamos por si queremos añadir navegación en el futuro
  //const router = useRouter();

  // Carga del total de personajes (igual que antes)
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const data = await getCharacters();
        if (data && data.info) {
          setTotalApi(data.info.count);
        }
      } catch (error) {
        console.error("Error cargando totales:", error);
      }
    };
    fetchTotal();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 1. SECCIÓN DE CABECERA (Logo y GIF) */}
      <View style={styles.headerContainer}>

        <Image 
          source={require('../../assets/images/logo.png')} // Ruta al archivo
          style={styles.logo}
          resizeMode="contain" 
        />

        {/* Boceto 'Gif' */}
        {/* Usamos el GIF de Portal */}
        {/* Colocamos el GIF animado justo debajo del logo */}
        <Image 
          source={require('../../assets/images/espacio.gif')} // Tu archivo GIF aquí
          style={styles.gifPortal}
          resizeMode="contain" // Contain para no deformar el portal
        />
      </View>

      {/* 2. SECCIÓN DE ESTADÍSTICAS (Cuadrados del boceto) */}
      <View style={styles.statsRow}>
        {/* Boceto 'Personajes' */}
        <View style={styles.miniCard}>
          <Text style={styles.miniNumber}>{totalApi}</Text>
          <Text style={styles.miniLabel}>Personajes</Text>
        </View>

        {/* Boceto 'Favoritos' */}
        <View style={[styles.miniCard, styles.miniCardFav]}>
          <Text style={styles.miniNumber}>{state.favorites.length}</Text>
          <Text style={styles.miniLabel}>Favoritos</Text>
        </View>
      </View>

      {/* Seccion de 'Accesos Rapidos' eliminada */}

    </ScrollView>
  );
}

// ESTILOS CLAVE PARA LA DISTRIBUCIÓN DEL BOCETO
const styles = StyleSheet.create({
  container: { 
    padding: 20,  
    flexGrow: 1 
  },
  headerContainer: {
    alignItems: 'center', // Centrado horizontal
    marginVertical: 30, // Espaciado arriba y abajo de la cabecera
    gap: 15, // Espacio automático entre el Logo y el GIF
  },
  logo: {
    width: 280, // Tamaño para Rick_and_Morty_logo
    height: 100,
  },
  gifPortal: {
    width: 200, // Tamaño del GIF (ajústalo a tu gusto)
    height: 120, // Altura para el portal
  },
  statsRow: { 
    flexDirection: 'row', // Coloca los elementos uno al lado del otro
    justifyContent: 'space-between', // Separa las dos tarjetas al máximo
    marginBottom: 30, 
  },
  miniCard: { 
    width: '48%', // Casi la mitad del ancho de pantalla para cada cuadrado
    backgroundColor: '#02afc5', 
    padding: 15, 
    borderRadius: 12, 
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center', // Centrado interno
  },
  miniCardFav: {
    backgroundColor: '#97ce4c', // Color diferente para la tarjeta de favoritos
  },
  miniNumber: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  miniLabel: { fontSize: 12, color: '#000000', textTransform: 'uppercase', marginTop: 3 },
});