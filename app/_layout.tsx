import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'; // <--- AÑADIDO: View, Text, StyleSheet
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

// IMPORTANTE: EL PROVIDER DE FAVORITOS DEBE ESTAR EN ESTE ARCHIVO
import { FavoritesProvider } from '@/context/FavoritesContext';

// Importamos el hook
import { useOffline } from '../hooks/useOffline';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isOffline = useOffline(); // <--- NUEVO: Llamamos al hook aquí

  return (
// EL PROVIDER DEBE ENVOLVER AL THEMEPROVIDER Y AL STACK
    <FavoritesProvider> 
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>⚠️ Estás en modo offline</Text>
          </View>
        )}
     
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="details/[id]" options={{ title: 'Detalle' }} />
        </Stack>
      </ThemeProvider>
    </FavoritesProvider>
  );
}

// --- NUEVO: ESTILOS PARA EL BANNER ---
const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#ff4444',
    padding: 10,
    paddingTop: 45, // Espacio extra para que no lo tape la barra de estado/notificaciones
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
