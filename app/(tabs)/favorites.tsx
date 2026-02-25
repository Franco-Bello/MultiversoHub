import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { logAction } from '../../services/telemetry';

export default function FavoritesScreen() {
  const { state, dispatch } = useFavorites();
  const router = useRouter();

  const clearAllFavorites = () => {
    Alert.alert(
      "Borrar todo",
      "¿Estás seguro de que quieres eliminar todos tus favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            // Para borrar todo, enviamos una lista vacía al SET_FAVORITES
            dispatch({ type: 'SET_FAVORITES', payload: [] });
            logAction('CLEAR_FAVORITES', 'Se vació la lista de favoritos');
          } 
        }
      ]
    );
  };

  if (state.favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No tienes favoritos aún. 🛸</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>{state.favorites.length} Personajes guardados</Text>
        <TouchableOpacity onPress={clearAllFavorites}>
          <Text style={styles.clearLink}>Borrar todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/details/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.species}>{item.species}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                dispatch({ type: 'REMOVE_FAVORITE', payload: item.id });
                logAction('REMOVE_FAVORITE', `Eliminado desde lista: ${item.name}`);
              }}
            >
              <Text style={styles.removeIcon}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    backgroundColor: '#f9f9f9',
    alignItems: 'center'
  },
  emptyText: { fontSize: 18, color: '#888' },
  countText: { fontWeight: 'bold' },
  clearLink: { color: 'red', fontWeight: 'bold' },
  card: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    alignItems: 'center' 
  },
  image: { width: 50, height: 50, borderRadius: 25 },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  species: { color: '#666' },
  removeIcon: { fontSize: 20, padding: 5 }
});