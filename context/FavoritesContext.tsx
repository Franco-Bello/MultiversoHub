import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { Character } from '../services/api';

// Definimos el estado inicial
interface FavoritesState {
  favorites: Character[];
}

// Definimos las acciones posibles
type FavoritesAction = 
  | { type: 'ADD_FAVORITE'; payload: Character }
  | { type: 'REMOVE_FAVORITE'; payload: number };

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