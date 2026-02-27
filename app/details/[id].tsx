import { useColorScheme } from '@/components/useColorScheme'; // <--- IMPORTANTE: Hook para el tema
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { Character, getCharacterById } from '../../services/api';
import { logAction } from '../../services/telemetry';

const { width } = Dimensions.get('window'); // <--- NUEVO: Para ajustar la tarjeta al ancho de pantalla

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useFavorites();

  // --- MODIFICACIÓN PARA TEMA OSCURO ---
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Definición de colores dinámicos
  const theme = {
    background: isDark ? '#121212' : '#f8f9fa',
    card: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#ffffff' : '#050000',
    subtext: isDark ? '#ffffff' : '#000000',
    border: isDark ? '#333333' : '#f0f0f0',
    episodeTag: isDark ? '#333333' : '#e9ecef'
  };

  useEffect(() => {
    if (id) loadCharacter();
  }, [id]);

  const loadCharacter = async () => {
    try {
      const data = await getCharacterById(id as string);
      setCharacter(data);
      logAction('VIEW_DETAILS', `Viendo detalle del personaje ID: ${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#00ff00" /></View>;
  if (!character) return <Text style={styles.center}>Personaje no encontrado</Text>;

  const isFavorite = state.favorites.some((fav) => fav.id === character.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: character.id });
      logAction('REMOVE_FAVORITE', `Eliminado: ${character.name}`);
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: character });
      logAction('ADD_FAVORITE', `Agregado: ${character.name}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: character.name }} />
      
      {/* --- TARJETA PRINCIPAL --- */}
      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: isDark ? '#000' : '#ffffff' }]}>
        <Image source={{ uri: character.image }} style={styles.image} />
        
        <View style={[styles.headerInfo, { borderBottomColor: theme.border }]}>
          <Text style={[styles.name, { color: theme.text }]}>{character.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: character.status === 'Alive' ? '#4caf50' : '#f44336' }]}>
            <Text style={styles.statusText}>{character.status}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.label, { color: theme.subtext }]}>Especie</Text>
            <Text style={[styles.value, { color: theme.text }]}>{character.species}</Text>
          </View>

        </View>

        <TouchableOpacity 
          style={[styles.favButton, isFavorite ? styles.favActive : styles.favInactive]} 
          onPress={toggleFavorite}
        >
          <Text style={[styles.favButtonText, { color: isFavorite ? '#000' : '#666' }]}>
            {isFavorite ? "⭐ En tus Favoritos" : "☆ Agregar a Favoritos"}
          </Text>
        </TouchableOpacity>
      

      {/* --- SECCIÓN DE EPISODIOS MODIFICADA --- */}
      <View style={styles.episodesContainer}>
        <Text style={[styles.subtitle, { color: theme.text }]}>Apariciones en Episodios</Text>
        <View style={styles.episodesGrid}>
          {character.episode.map((ep, index) => ( // Mostramos los primeros 10 para no saturar
            <View key={index} style={[styles.episodeTag, { backgroundColor: theme.episodeTag }]}>
              <Text style={[styles.episodeTagText, { color: theme.subtext }]}>EP {ep.split('/').pop()}</Text>
            </View>
          ))}
        </View>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  content: { paddingBottom: 30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // --- ESTILOS DE LA TARJETA (NUEVO) ---
  card: {

    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: { 
    width: '100%', 
    height: 400, 
  },
  headerInfo: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  name: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  
  detailsRow: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  detailItem: { alignItems: 'center', flex: 1 },
  label: { fontSize: 12, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '600', color: '#444' },

  // --- BOTÓN ESTILIZADO ---
  favButton: {
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  favActive: { backgroundColor: '#ffc107', borderColor: '#ffc107' },
  favInactive: { backgroundColor: '#fff', borderColor: '#ddd' },
  favButtonText: { fontWeight: 'bold', fontSize: 16 },

  // --- EPISODIOS ESTILO GRID ---
  episodesContainer: { paddingHorizontal: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  episodesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  episodeTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  episodeTagText: { fontSize: 12, color: '#666', fontWeight: 'bold' }
});