import { CACHE_CONFIG, RETRY_CONFIG } from '../api/config/apiConfig';

// Caché simple en memoria
const apiCache = new Map();

/**
 * Obtiene un elemento de la caché
 * @param {string} key - Clave para buscar en la caché
 * @returns {any|null} - Valor almacenado o null si no existe o expiró
 */
export const getCacheItem = (key) => {
  if (!apiCache.has(key)) {
    return null;
  }

  const { value, expiry } = apiCache.get(key);
  
  // Verificar si el elemento ha expirado
  if (expiry < Date.now()) {
    apiCache.delete(key);
    return null;
  }
  
  return value;
};

/**
 * Almacena un elemento en la caché
 * @param {string} key - Clave para almacenar
 * @param {any} value - Valor a almacenar
 * @param {number} ttl - Tiempo de vida en milisegundos (opcional)
 */
export const setCacheItem = (key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) => {
  const expiry = Date.now() + ttl;
  apiCache.set(key, { value, expiry });
};

/**
 * Limpia toda la caché o elementos específicos
 * @param {string|null} keyPattern - Patrón de clave para limpiar elementos específicos (opcional)
 */
export const clearCache = (keyPattern = null) => {
  if (!keyPattern) {
    apiCache.clear();
    return;
  }
  
  // Eliminar elementos que coincidan con el patrón
  const regex = new RegExp(keyPattern);
  for (const key of apiCache.keys()) {
    if (regex.test(key)) {
      apiCache.delete(key);
    }
  }
};

/**
 * Función para reintentar una operación con backoff exponencial
 * @param {Function} operation - Función a ejecutar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delay - Retraso inicial en milisegundos
 * @returns {Promise<any>} - Resultado de la operación
 */
export const retryOperation = async (
  operation,
  maxRetries = RETRY_CONFIG.MAX_RETRIES,
  delay = RETRY_CONFIG.RETRY_DELAY
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Si es el último intento, no esperamos
      if (attempt === maxRetries) {
        break;
      }
      
      // Calcular el tiempo de espera con backoff exponencial
      const waitTime = delay * Math.pow(2, attempt);
      console.log(`Reintento ${attempt + 1}/${maxRetries} después de ${waitTime}ms`);
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

/**
 * Genera una clave de caché basada en la URL y los parámetros
 * @param {string} url - URL de la petición
 * @param {Object} params - Parámetros de la petición
 * @returns {string} - Clave de caché
 */
export const generateCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  return `${url}?${sortedParams}`;
};

/**
 * Función para realizar peticiones con caché
 * @param {Function} requestFn - Función que realiza la petición
 * @param {string} cacheKey - Clave para almacenar en caché
 * @param {number} ttl - Tiempo de vida en caché
 * @returns {Promise<any>} - Resultado de la petición
 */
export const cachedRequest = async (requestFn, cacheKey, ttl = CACHE_CONFIG.DEFAULT_TTL) => {
  // Intentar obtener de la caché primero
  const cachedData = getCacheItem(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // Si no está en caché, realizar la petición
  const result = await requestFn();
  
  // Almacenar en caché
  setCacheItem(cacheKey, result, ttl);
  
  return result;
};
