import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// CAMBIO AQUÍ: Importamos la función getCharacters desde tu service
import { Character, getCharacters } from '../../services/api';
import { logAction } from '../../services/telemetry';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const isRequestInProgress = useRef(false);

  // NUEVO AQUÍ: Referencia para controlar el scroll de la lista
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      loadData(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [name, status]);

  useEffect(() => {
    if (page > 1) {
      loadData(false);
    }
  }, [page]);


  //
  const loadData = async (shouldReset = false) => {
    if (isRequestInProgress.current) return;
    if (!shouldReset && !hasMore) return;

    isRequestInProgress.current = true;

    if (shouldReset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const currentPage = shouldReset ? 1 : page;

      // CAMBIO AQUÍ: Usamos la función del service en lugar del fetch manual
      const data = await getCharacters(currentPage, status, name);

      // CAMBIO AQUÍ: Adaptamos la lógica para manejar cuando no hay resultados (404 oculto en el service)
      if (data && data.results) {
        setCharacters(prev => shouldReset ? data.results : [...prev, ...data.results]);
        setHasMore(data.info.next !== null);
        logAction('FETCH_CHARACTERS', `Cargada página ${currentPage}`);
      } else {
        // Si no hay resultados (la API devolvió error de búsqueda)
        if (shouldReset) setCharacters([]);
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error cargando personajes:", error);
      // Opcional: podrías poner setHasMore(false) aquí si el error es persistente
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      isRequestInProgress.current = false;
    }
  };

  // NUEVO AQUÍ: Función para cargar más datos al llegar al final de la lista
  const handleLoadMore = () => {
    if (!isRequestInProgress.current && hasMore && !loading && !isFetchingMore) {
      setPage(prev => prev + 1);
    }
  };

  // NUEVO AQUÍ: Mapeo de colores para cada estado
  const statusColors: Record<string, string> = {
  alive: '#2ecc71',    // Verde
  dead: '#e74c3c',     // Rojo
  unknown: '#9b59b6',  // Morado
  '': '#3498db',       // Azul (para TODOS)
};

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.filterBar}>
        {['', 'alive', 'dead', 'unknown'].map((s) => (
          <TouchableOpacity 
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.filterBtn, status === s && { backgroundColor: statusColors[s] }
            ]}
          >
            <Text style={[styles.filterText, status === s && { color: '#fff' }  

            ]}>
              {s === '' ? 'TODOS' : 
              s === 'alive' ? 'VIVO' : 
              s === 'dead' ? 'MUERTO' : 
              'INCÓGNITO'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef} // NUEVO AQUÍ: Asignamos la referencia al FlatList
        data={characters}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/details/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>
                {item.status === 'unknown' ? '❓ Desconocido' : item.status} - {item.species}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          isFetchingMore ? <ActivityIndicator size="small" color="#00ff00" style={{ margin: 20 }} /> : null
        )}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No se encontraron resultados</Text> : null}
      />
    </View>
  );
}

// ... (tus estilos se mantienen igual)
const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 15},
  searchInput: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
  },
  filterBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#e9ecef' },
  activeBtn: { backgroundColor: '#00ff00' },
  filterText: { fontSize: 11, color: '#495057' },
  activeText: { fontWeight: 'bold', color: '#000' },
  card: { 
    flexDirection: 'row', 
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10, 
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  image: { width: 60, height: 60, borderRadius: 30 },
  info: { marginLeft: 15, flex: 1 },
  name: { fontSize: 17, fontWeight: 'bold' },
  status: { color: '#666', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});