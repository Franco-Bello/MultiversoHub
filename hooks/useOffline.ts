import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useOffline = () => {
  // Estado para saber si está desconectado
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Nos suscribimos a los cambios de red
    const unsubscribe = NetInfo.addEventListener(state => {
      // Si isConnected es falso, entonces está offline
      setIsOffline(state.isConnected === false);
    });

    // Limpiamos la suscripción al desmontar el hook
    return () => unsubscribe();
  }, []);

  return isOffline;
};