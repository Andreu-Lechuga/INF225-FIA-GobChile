import { useState, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para realizar llamadas a APIs
 * @param {Function} apiFunction - Función del servicio de API a ejecutar
 * @param {Array} dependencies - Dependencias para ejecutar automáticamente (opcional)
 * @param {boolean} executeOnMount - Si debe ejecutarse al montar el componente (opcional)
 * @param {Array} initialParams - Parámetros iniciales para la ejecución automática (opcional)
 * @returns {Object} - Estado y funciones para manejar la llamada a la API
 */
export const useApi = (
  apiFunction,
  dependencies = [],
  executeOnMount = false,
  initialParams = []
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Ejecuta la función de API con los parámetros proporcionados
   * @param {...any} params - Parámetros para pasar a la función de API
   * @returns {Promise<any>} - Promesa que resuelve a los datos de la respuesta
   */
  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Ejecutar automáticamente si se especifica
  useEffect(() => {
    if (executeOnMount) {
      execute(...initialParams);
    }
  }, [execute, executeOnMount, ...dependencies, ...initialParams]);

  /**
   * Reinicia el estado del hook
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

export default useApi;
