import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../context/FavoritesContext';
import { getCharacters } from '../../services/api';

export default function HomeScreen() {
  const { state } = useFavorites();
  const [totalApi, setTotalApi] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const data = await getCharacters();
        // data.info.count tiene el total de personajes en la base de datos
        setTotalApi(data.info.count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTotal();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Multiverso Hub 🚀</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalApi}</Text>
          <Text style={styles.statLabel}>Personajes en el Multiverso</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.statNumber}>{state.favorites.length}</Text>
          <Text style={styles.statLabel}>Tus Favoritos</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Text style={styles.subtitle}>Accesos Rápidos</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/characters')}
        >
          <Text style={styles.buttonText}>Explorar Personajes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#333' }]} 
          onPress={() => router.push('/favorites')}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Ver mis Favoritos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#2ecc71' },
  statsContainer: { width: '100%', gap: 15, marginBottom: 30 },
  statCard: { 
    padding: 20, 
    borderRadius: 15, 
    backgroundColor: '#f0f0f0', 
    alignItems: 'center',
    elevation: 2 
  },
  statNumber: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#666' },
  menu: { width: '100%' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  button: { 
    padding: 15, 
    borderRadius: 10, 
    backgroundColor: '#e1f5fe', 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  buttonText: { fontSize: 16, fontWeight: '600' }
});