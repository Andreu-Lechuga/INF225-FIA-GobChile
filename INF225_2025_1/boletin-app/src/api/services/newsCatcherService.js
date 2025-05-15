import { newsCatcherAxios } from '../config/axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * Servicio para interactuar con la API de NewsCatcher
 * Documentación: https://docs.newscatcherapi.com/api-docs/endpoints
 */
export const newsCatcherService = {
  /**
   * Busca noticias según los criterios especificados
   * @param {string} query - Término de búsqueda
   * @param {Object} params - Parámetros adicionales de búsqueda
   * @returns {Promise<Object>} - Promesa que resuelve a los resultados de la búsqueda
   */
  searchNews: async (query, params = {}) => {
    try {
      const response = await newsCatcherAxios.get(API_CONFIG.NEWSCATCHER.ENDPOINTS.SEARCH, {
        params: {
          q: query,
          ...API_CONFIG.NEWSCATCHER.DEFAULT_PARAMS,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error buscando noticias:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene los titulares más recientes
   * @param {Object} params - Parámetros para filtrar los titulares
   * @returns {Promise<Object>} - Promesa que resuelve a los titulares
   */
  getLatestHeadlines: async (params = {}) => {
    try {
      const response = await newsCatcherAxios.get(API_CONFIG.NEWSCATCHER.ENDPOINTS.LATEST_HEADLINES, {
        params: {
          ...API_CONFIG.NEWSCATCHER.DEFAULT_PARAMS,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo titulares recientes:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene las fuentes de noticias disponibles
   * @param {Object} params - Parámetros para filtrar las fuentes
   * @returns {Promise<Object>} - Promesa que resuelve a las fuentes
   */
  getSources: async (params = {}) => {
    try {
      const response = await newsCatcherAxios.get(API_CONFIG.NEWSCATCHER.ENDPOINTS.SOURCES, {
        params: {
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo fuentes de noticias:', error);
      throw error;
    }
  },
  
  /**
   * Busca noticias similares a una URL dada
   * @param {string} url - URL de la noticia para encontrar similares
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Promesa que resuelve a noticias similares
   */
  getSimilarNews: async (url, params = {}) => {
    try {
      const response = await newsCatcherAxios.get(API_CONFIG.NEWSCATCHER.ENDPOINTS.SIMILAR, {
        params: {
          url,
          ...API_CONFIG.NEWSCATCHER.DEFAULT_PARAMS,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo noticias similares:', error);
      throw error;
    }
  }
};

export default newsCatcherService;
