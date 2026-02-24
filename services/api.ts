// services/api.ts

export interface Character { 
    id: number; 
    name: string; 
    status: string; 
    species: string; 
    image: string; 
    episode: string[]; 
}

// Interfaz para la respuesta de la lista (paginación)
interface ApiResponse {
    info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
    };
    results: Character[];
}

const BASE_URL = 'https://rickandmortyapi.com/api';

// Añadimos ": Promise<ApiResponse>" para que TS sepa qué devuelve
export const getCharacters = async (page = 1): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/character?page=${page}`);
    if (!response.ok) throw new Error('Error al obtener personajes');
    return await response.json(); 
  } catch (error) {
    console.error("Error en api.ts:", error);
    throw error;
  }
};

// Añadimos ": Promise<Character>" para el detalle
export const getCharacterById = async (id: string | number): Promise<Character> => {
  try {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    if (!response.ok) throw new Error('Error al obtener el detalle');
    return await response.json();
  } catch (error) {
    console.error("Error en getCharacterById:", error);
    throw error;
  }
};