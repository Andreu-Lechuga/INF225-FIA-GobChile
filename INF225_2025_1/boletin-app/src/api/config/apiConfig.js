// Configuraciones generales para APIs
export const API_CONFIG = {
  NEWSCATCHER: {
    BASE_URL: process.env.REACT_APP_NEWSCATCHER_API_URL,
    ENDPOINTS: {
      SEARCH: '/search',
      LATEST_HEADLINES: '/latest-headlines',
      SOURCES: '/sources',
      SIMILAR: '/similar'
    },
    DEFAULT_PARAMS: {
      // Parámetros por defecto para Newscatcher API
      lang: 'es',
      countries: 'CL',
      page_size: 10
    }
  }
};

// Configuración de tiempos de caché (en milisegundos)
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  SEARCH_TTL: 2 * 60 * 1000,  // 2 minutos
  STATIC_TTL: 60 * 60 * 1000, // 1 hora
};

// Configuración de reintentos
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
};
