import { newsCatcherAxios } from '../config/axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * Función auxiliar para calcular fechas relativas
 * @param {number} months - Número de meses a restar de la fecha actual
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
const getDateXMonthsAgo = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

/**
 * Definición de las listas de URLs para cada tipo de fuente
 * IMPORTANTE: Los nombres de las categorías deben coincidir exactamente con los del BoletinForm
 */
const sourcesByType = {
  "Académicas": [
    'redalyc.org', 'dialnet.unirioja.es', 'academia.edu',
    'researchgate.net', 'jstor.org', 'eric.ed.gov',
    'agronomia.uchile.cl', 'scielo.org', 'latindex.org'
  ],
  "Científicas": [
    'scielo.org', 'redalyc.org', 'dialnet.unirioja.es',
    'fao.org', 'inia.cl', 'agronomia.uchile.cl',
    'sciencedirect.com', 'springer.com', 'mdpi.com'
  ],
  "Gubernamentales": [
    'gob.cl', 'minagri.gob.cl', 'odepa.gob.cl',
    'indap.gob.cl', 'sag.gob.cl', 'inia.gob.cl',
    'fao.org', 'agricultura.gob.es', 'gob.mx'
  ],
  "Noticias": [
    'elmercurio.com', 'latercera.com', 'campoagroalimentario.cl',
    'redagricola.com', 'portalfruticola.com', 'mundoagro.cl',
    'agronomia.net', 'infoagro.com', 'agrodigital.com'
  ]
};

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
  },
  
  /**
   * Busca información científica agrícola en fuentes académicas y confiables
   * @param {string} query - Término de búsqueda
   * @param {Object} options - Opciones adicionales para la búsqueda
   * @returns {Promise<Object>} - Promesa que resuelve a los resultados de la búsqueda
   */
  /**
   * Busca información según los tipos de fuentes seleccionados
   * @param {string} query - Término de búsqueda
   * @param {Array} tiposFuentes - Tipos de fuentes seleccionados
   * @param {Object} options - Opciones adicionales para la búsqueda
   * @returns {Promise<Object>} - Promesa que resuelve a los resultados de la búsqueda
   */
  searchBySourceTypes: async (query, tiposFuentes = [], options = {}) => {
    try {
      // Determinar qué fuentes incluir
      let selectedSources = [];
      
      // Si se seleccionó "Todas las anteriores", incluir todas las fuentes
      if (tiposFuentes.includes("Todas las anteriores")) {
        Object.values(sourcesByType).forEach(sources => {
          selectedSources = [...selectedSources, ...sources];
        });
      } else {
        // De lo contrario, incluir solo las fuentes de los tipos seleccionados
        tiposFuentes.forEach(tipo => {
          if (sourcesByType[tipo]) {
            selectedSources = [...selectedSources, ...sourcesByType[tipo]];
          }
        });
      }
      
      // Eliminar duplicados (algunas fuentes pueden estar en múltiples categorías)
      selectedSources = [...new Set(selectedSources)];
      
      // Configurar parámetros de búsqueda
      const defaultParams = {
        lang: 'es',
        countries: 'CL,ES,MX,AR,CO,PE',
        from: options.from || getDateXMonthsAgo(3),
        to: options.to || new Date().toISOString().split('T')[0],
        search_in: 'title,summary,content',
        sort_by: 'relevancy',
        sources: selectedSources.join(','),
        ranked_only: true,
        page_size: 20
      };
      
      // Realizar la búsqueda
      return await newsCatcherService.searchNews(query, {...defaultParams, ...options});
    } catch (error) {
      console.error('Error buscando por tipos de fuentes:', error);
      throw error;
    }
  },
  
  searchAgriculturalScience: async (query, options = {}) => {
    try {
      // Usar directamente la lista de fuentes científicas definida globalmente
      const defaultParams = {
        lang: 'es',
        countries: 'CL,ES,MX,AR,CO,PE',
        from: getDateXMonthsAgo(3),
        to: new Date().toISOString().split('T')[0],
        topic: 'science,environment,agriculture',
        sort_by: 'relevancy',
        sources: sourcesByType["Científicas"].join(','),
        ranked_only: true,
        page_size: 20
      };
      
      return await newsCatcherService.searchNews(query, {...defaultParams, ...options});
    } catch (error) {
      console.error('Error buscando información científica agrícola:', error);
      throw error;
    }
  },
  
  /**
   * Monitorea tendencias agrícolas específicas
   * @param {string} trendType - Tipo de tendencia ('cultivos', 'plagas', 'enfermedades', 'clima')
   * @param {Object} options - Opciones adicionales para la búsqueda
   * @returns {Promise<Object>} - Promesa que resuelve a los resultados de la búsqueda
   */
  monitorAgricultureTrends: async (trendType, options = {}) => {
    try {
      const trendQueries = {
        'cultivos': 'cultivo OR cosecha OR producción OR rendimiento',
        'plagas': 'plaga OR insecto OR control OR fumigación',
        'enfermedades': 'enfermedad OR patógeno OR hongo OR bacteria OR virus',
        'clima': 'clima OR sequía OR lluvia OR temperatura OR helada'
      };
      
      const defaultParams = {
        lang: 'es',
        countries: 'CL,ES,MX,AR,CO,PE',
        from: getDateXMonthsAgo(3),
        to: new Date().toISOString().split('T')[0],
        sort_by: 'date',
        search_in: 'title,summary,content',
        page_size: 20
      };
      
      const query = trendQueries[trendType] || trendType;
      return await newsCatcherService.searchNews(query, {...defaultParams, ...options});
    } catch (error) {
      console.error('Error monitoreando tendencias agrícolas:', error);
      throw error;
    }
  }
};

export default newsCatcherService;
