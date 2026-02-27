// services/api.ts

export interface Character { 
    id: number; 
    name: string; 
    status: string; 
    species: string; 
    image: string; 
    episode: string[]; 
}

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

// RECOMENDACIÓN: Añadir name y status como parámetros opcionales
export const getCharacters = async (
  page = 1, 
  status = '', 
  name = ''
): Promise<ApiResponse> => {
  try {
    // Construimos la URL con los parámetros de filtro
    const url = `${BASE_URL}/character?page=${page}&status=${status}&name=${name}`;
    
    const response = await fetch(url);

    
    
    // IMPORTANTE: La API de Rick and Morty devuelve 404 si no encuentra resultados
    // No siempre es un "error de servidor", a veces es "no hay resultados para esa búsqueda"
    if (!response.ok && response.status !== 404) {
      throw new Error('Error al obtener personajes');
    }
    
    return await response.json(); 
  } catch (error) {
    console.error("Error en api.ts:", error);
    throw error;
  }
};

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