import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import newsCatcherService from '../services/newsCatcherService';

/**
 * Hook personalizado para interactuar con la API de NewsCatcher
 * @returns {Object} - Funciones y estados para interactuar con NewsCatcher API
 */
export const useNewsCatcher = () => {
  // Estado para almacenar las noticias
  const [news, setNews] = useState([]);
  
  // Hooks para cada endpoint de la API
  const searchApi = useApi(newsCatcherService.searchNews);
  const headlinesApi = useApi(newsCatcherService.getLatestHeadlines);
  const sourcesApi = useApi(newsCatcherService.getSources);
  const similarApi = useApi(newsCatcherService.getSimilarNews);
  
  /**
   * Busca noticias según los criterios especificados
   * @param {string} query - Término de búsqueda
   * @param {Object} params - Parámetros adicionales de búsqueda
   * @returns {Promise<Object>} - Promesa que resuelve a los resultados de la búsqueda
   */
  const searchNews = useCallback(async (query, params = {}) => {
    const result = await searchApi.execute(query, params);
    if (result && result.articles) {
      setNews(result.articles);
    }
    return result;
  }, [searchApi]);
  
  /**
   * Obtiene los titulares más recientes
   * @param {Object} params - Parámetros para filtrar los titulares
   * @returns {Promise<Object>} - Promesa que resuelve a los titulares
   */
  const getLatestHeadlines = useCallback(async (params = {}) => {
    const result = await headlinesApi.execute(params);
    if (result && result.articles) {
      setNews(result.articles);
    }
    return result;
  }, [headlinesApi]);
  
  /**
   * Obtiene las fuentes de noticias disponibles
   * @param {Object} params - Parámetros para filtrar las fuentes
   * @returns {Promise<Object>} - Promesa que resuelve a las fuentes
   */
  const getSources = useCallback(async (params = {}) => {
    return await sourcesApi.execute(params);
  }, [sourcesApi]);
  
  /**
   * Busca noticias similares a una URL dada
   * @param {string} url - URL de la noticia para encontrar similares
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Promesa que resuelve a noticias similares
   */
  const getSimilarNews = useCallback(async (url, params = {}) => {
    const result = await similarApi.execute(url, params);
    if (result && result.articles) {
      setNews(result.articles);
    }
    return result;
  }, [similarApi]);
  
  // Estado de carga combinado
  const loading = searchApi.loading || headlinesApi.loading || 
                 sourcesApi.loading || similarApi.loading;
  
  // Error combinado (el primero que ocurra)
  const error = searchApi.error || headlinesApi.error || 
               sourcesApi.error || similarApi.error;
  
  return {
    // Datos
    news,
    sources: sourcesApi.data,
    
    // Estado
    loading,
    error,
    
    // Métodos
    searchNews,
    getLatestHeadlines,
    getSources,
    getSimilarNews,
    
    // Reset
    reset: useCallback(() => {
      setNews([]);
      searchApi.reset();
      headlinesApi.reset();
      sourcesApi.reset();
      similarApi.reset();
    }, [searchApi, headlinesApi, sourcesApi, similarApi])
  };
};

export default useNewsCatcher;
