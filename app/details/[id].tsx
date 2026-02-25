import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
// Importamos TouchableOpacity para el botón
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Character, getCharacterById } from '../../services/api';
import { logAction } from '../../services/telemetry';
// IMPORTANTE: Traemos el hook de favoritos
import { useFavorites } from '../../context/FavoritesContext';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  // CONECTAMOS CON EL CONTEXTO
  const { state, dispatch } = useFavorites();

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

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (!character) return <Text style={styles.center}>Personaje no encontrado</Text>;

  // Verificamos si este personaje ya está en favoritos
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
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: character.name }} />
      
      <Image source={{ uri: character.image }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{character.status}</Text>
        
        <Text style={styles.label}>Especie:</Text>
        <Text style={styles.value}>{character.species}</Text>

        {/* --- EL BOTÓN QUE TE FALTABA --- */}
        <TouchableOpacity style={[styles.favButton, isFavorite ? styles.favActive : styles.favInactive]} onPress={toggleFavorite}>
          <Text style={styles.favButtonText}>
            {isFavorite ? "⭐ Quitar de Favoritos" : "☆ Agregar a Favoritos"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Apariciones en Episodios:</Text>
        {character.episode.map((ep, index) => (
          <Text key={index} style={styles.episodeText}>
            • Episodio {ep.split('/').pop()}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300 },
  infoContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#888', marginTop: 10 },
  value: { fontSize: 18, marginBottom: 5 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  episodeText: { fontSize: 16, color: '#444', marginBottom: 4 },
  // ESTILOS DEL BOTÓN
  favButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favActive: { backgroundColor: '#ffc107' }, // Amarillo
  favInactive: { backgroundColor: '#f0f0f0' }, // Gris
  favButtonText: { fontWeight: 'bold', fontSize: 16 }
});