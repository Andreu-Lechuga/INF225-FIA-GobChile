import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiService1 from '../../../api/services/apiService1';
import { API_CONFIG } from '../../../api/config/apiConfig';

// Crear un adaptador mock para axios
const mockAxios = new MockAdapter(axios);
const BASE_URL = API_CONFIG.API_SERVICE_1.BASE_URL;
const RESOURCE_ENDPOINT = API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1;

describe('apiService1 integration tests', () => {
  // Limpiar todas las peticiones mock después de cada prueba
  afterEach(() => {
    mockAxios.reset();
  });

  // Restaurar axios después de todas las pruebas
  afterAll(() => {
    mockAxios.restore();
  });

  describe('getResources', () => {
    test('debería obtener una lista de recursos correctamente', async () => {
      // Datos de prueba
      const mockResources = [
        { id: 1, name: 'Recurso 1' },
        { id: 2, name: 'Recurso 2' }
      ];
      
      // Configurar la respuesta mock
      mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(200, mockResources);
      
      // Llamar al servicio
      const result = await apiService1.getResources();
      
      // Verificar el resultado
      expect(result).toEqual(mockResources);
    });
    
    test('debería incluir parámetros de consulta correctamente', async () => {
      // Datos de prueba
      const mockResources = [{ id: 1, name: 'Recurso Filtrado' }];
      const params = { category: 'test', limit: 10 };
      
      // Configurar la respuesta mock con verificación de parámetros
      mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(config => {
        // Verificar que los parámetros se pasaron correctamente
        expect(config.params).toMatchObject({
          ...API_CONFIG.API_SERVICE_1.DEFAULT_PARAMS,
          ...params
        });
        return [200, mockResources];
      });
      
      // Llamar al servicio con parámetros
      const result = await apiService1.getResources(params);
      
      // Verificar el resultado
      expect(result).toEqual(mockResources);
    });
    
    test('debería manejar errores correctamente', async () => {
      // Configurar la respuesta mock con error
      mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(500, {
        message: 'Error interno del servidor'
      });
      
      // Esperar que la llamada al servicio lance un error
      await expect(apiService1.getResources()).rejects.toThrow();
    });
  });
  
  describe('getResourceById', () => {
    test('debería obtener un recurso específico por ID', async () => {
      // Datos de prueba
      const resourceId = 123;
      const mockResource = { id: resourceId, name: 'Recurso Específico' };
      
      // Configurar la respuesta mock
      mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}/${resourceId}`).reply(200, mockResource);
      
      // Llamar al servicio
      const result = await apiService1.getResourceById(resourceId);
      
      // Verificar el resultado
      expect(result).toEqual(mockResource);
    });
    
    test('debería manejar el caso de recurso no encontrado', async () => {
      // Datos de prueba
      const resourceId = 999;
      
      // Configurar la respuesta mock con error 404
      mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}/${resourceId}`).reply(404, {
        message: 'Recurso no encontrado'
      });
      
      // Esperar que la llamada al servicio lance un error
      await expect(apiService1.getResourceById(resourceId)).rejects.toThrow();
    });
  });
  
  describe('createResource', () => {
    test('debería crear un recurso correctamente', async () => {
      // Datos de prueba
      const newResource = { name: 'Nuevo Recurso' };
      const createdResource = { id: 123, ...newResource };
      
      // Configurar la respuesta mock
      mockAxios.onPost(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(config => {
        // Verificar que los datos se enviaron correctamente
        expect(JSON.parse(config.data)).toEqual(newResource);
        return [201, createdResource];
      });
      
      // Llamar al servicio
      const result = await apiService1.createResource(newResource);
      
      // Verificar el resultado
      expect(result).toEqual(createdResource);
    });
  });
  
  describe('updateResource', () => {
    test('debería actualizar un recurso correctamente', async () => {
      // Datos de prueba
      const resourceId = 123;
      const updateData = { name: 'Recurso Actualizado' };
      const updatedResource = { id: resourceId, ...updateData };
      
      // Configurar la respuesta mock
      mockAxios.onPut(`${BASE_URL}${RESOURCE_ENDPOINT}/${resourceId}`).reply(config => {
        // Verificar que los datos se enviaron correctamente
        expect(JSON.parse(config.data)).toEqual(updateData);
        return [200, updatedResource];
      });
      
      // Llamar al servicio
      const result = await apiService1.updateResource(resourceId, updateData);
      
      // Verificar el resultado
      expect(result).toEqual(updatedResource);
    });
  });
  
  describe('deleteResource', () => {
    test('debería eliminar un recurso correctamente', async () => {
      // Datos de prueba
      const resourceId = 123;
      const deleteResponse = { success: true, message: 'Recurso eliminado' };
      
      // Configurar la respuesta mock
      mockAxios.onDelete(`${BASE_URL}${RESOURCE_ENDPOINT}/${resourceId}`).reply(200, deleteResponse);
      
      // Llamar al servicio
      const result = await apiService1.deleteResource(resourceId);
      
      // Verificar el resultado
      expect(result).toEqual(deleteResponse);
    });
  });
});
