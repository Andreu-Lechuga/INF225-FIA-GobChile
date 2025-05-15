import axiosInstance from '../config/axios';
import { API_CONFIG } from '../config/apiConfig';

const BASE_URL = API_CONFIG.API_SERVICE_1.BASE_URL;

/**
 * Servicio para interactuar con la API 1
 */
export const apiService1 = {
  /**
   * Obtiene una lista de recursos
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Array>} - Promesa que resuelve a un array de recursos
   */
  getResources: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}${API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1}`, 
        { 
          params: {
            ...API_CONFIG.API_SERVICE_1.DEFAULT_PARAMS,
            ...params
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo recursos:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un recurso específico por ID
   * @param {string|number} id - ID del recurso
   * @returns {Promise<Object>} - Promesa que resuelve al recurso
   */
  getResourceById: async (id) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}${API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo recurso con ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo recurso
   * @param {Object} data - Datos del nuevo recurso
   * @returns {Promise<Object>} - Promesa que resuelve al recurso creado
   */
  createResource: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}${API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1}`, 
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creando recurso:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza un recurso existente
   * @param {string|number} id - ID del recurso a actualizar
   * @param {Object} data - Datos actualizados
   * @returns {Promise<Object>} - Promesa que resuelve al recurso actualizado
   */
  updateResource: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}${API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1}/${id}`, 
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error actualizando recurso con ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Elimina un recurso
   * @param {string|number} id - ID del recurso a eliminar
   * @returns {Promise<Object>} - Promesa que resuelve a la respuesta de eliminación
   */
  deleteResource: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}${API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error eliminando recurso con ID ${id}:`, error);
      throw error;
    }
  }
};

export default apiService1;
