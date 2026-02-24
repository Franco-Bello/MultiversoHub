import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Character, getCharacterById } from '../../services/api';
import { logAction } from '../../services/telemetry';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams(); // Obtenemos el ID de la URL
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCharacter();
  }, [id]);

  const loadCharacter = async () => {
    try {
      const data = await getCharacterById(id as string);
      setCharacter(data);
      // Punto 8: Telemetría de visualización de detalle
      logAction('VIEW_DETAILS', `Viendo detalle del personaje ID: ${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (!character) return <Text>Personaje no encontrado</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Esto configura el título de la cabecera dinámicamente */}
      <Stack.Screen options={{ title: character.name }} />
      
      <Image source={{ uri: character.image }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{character.status}</Text>
        
        <Text style={styles.label}>Especie:</Text>
        <Text style={styles.value}>{character.species}</Text>

        <Text style={styles.subtitle}>Apariciones en Episodios:</Text>
        {/* Punto 3: Listado de episodios extraídos del array character.episode */}
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
  center: { flex: 1, justifyContent: 'center' },
  image: { width: '100%', height: 300 },
  infoContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#888', marginTop: 10 },
  value: { fontSize: 20, marginBottom: 5 },
  subtitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  episodeText: { fontSize: 16, color: '#444', marginBottom: 4 }
});