import { useRouter } from 'expo-router'; // Para la navegación al detalle
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Character, getCharacters } from '../../services/api';
import { logAction } from '../../services/telemetry';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getCharacters();
      setCharacters(data.results);
      // Punto 8: Registro de telemetría al cargar exitosamente 
      logAction('FETCH_CHARACTERS', `Cargados ${data.results.length} personajes.`);
    } catch (error) {
      console.error("Error cargando personajes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            // Navegamos al detalle pasando el ID (Punto 3) [cite: 20]
            onPress={() => router.push(`/details/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>{item.status} - {item.species}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    alignItems: 'center' 
  },
  image: { width: 60, height: 60, borderRadius: 30 },
  info: { marginLeft: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  status: { color: '#666' }
});