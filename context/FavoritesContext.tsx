import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Añadido AsyncStorage
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { Character } from '../services/api';

// Definimos el estado inicial
interface FavoritesState {
  favorites: Character[];
}

// Definimos las acciones posibles
type FavoritesAction = 
  | { type: 'ADD_FAVORITE'; payload: Character }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'SET_FAVORITES'; payload: Character[] };

const initialState: FavoritesState = {
  favorites: [],
};

// Reducer: Lógica para añadir o quitar de la lista
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      // Evitamos duplicados
      if (state.favorites.find(char => char.id === action.payload.id)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(char => char.id !== action.payload) };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    default:
      return state;
  }
}

// Creamos el Contexto
const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
} | undefined>(undefined);

// Provider que envolverá la aplicación
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // 1. AÑADIDO: EFECTO DE CARGA (Se ejecuta UNA VEZ al abrir la app)
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('@favorites_key');
        if (saved !== null) {
          dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(saved) });
        }
      } catch (e) {
        console.error("Error al cargar favoritos de la memoria", e);
      }
    };
    loadData();
  }, []);

  // 2. AÑADIDO: EFECTO DE GUARDADO (Se ejecuta CADA VEZ que cambia state.favorites)
  useEffect(() => {
    const saveData = async () => {
      try {
        const jsonValue = JSON.stringify(state.favorites);
        await AsyncStorage.setItem('@favorites_key', jsonValue);
      } catch (e) {
        console.error("Error al guardar favoritos", e);
      }
    };
    saveData();
  }, [state.favorites]);

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return context;
};