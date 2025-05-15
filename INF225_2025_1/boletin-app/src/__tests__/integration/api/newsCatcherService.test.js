import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import newsCatcherService from '../../../api/services/newsCatcherService';
import { API_CONFIG } from '../../../api/config/apiConfig';
import { newsCatcherAxios } from '../../../api/config/axios';

// Crear un adaptador mock para axios
const mockAxios = new MockAdapter(newsCatcherAxios);
const BASE_URL = API_CONFIG.NEWSCATCHER.BASE_URL;

describe('newsCatcherService integration tests', () => {
  // Limpiar todas las peticiones mock después de cada prueba
  afterEach(() => {
    mockAxios.reset();
  });

  // Restaurar axios después de todas las pruebas
  afterAll(() => {
    mockAxios.restore();
  });

  describe('searchNews', () => {
    test('debería buscar noticias correctamente', async () => {
      // Datos de prueba
      const mockResponse = {
        status: 'ok',
        total_hits: 2,
        page: 1,
        total_pages: 1,
        page_size: 10,
        articles: [
          { 
            title: 'Noticia 1', 
            summary: 'Resumen de la noticia 1',
            published_date: '2025-05-14T10:00:00Z',
            link: 'https://example.com/noticia1',
            media: 'https://example.com/imagen1.jpg'
          },
          { 
            title: 'Noticia 2', 
            summary: 'Resumen de la noticia 2',
            published_date: '2025-05-14T09:00:00Z',
            link: 'https://example.com/noticia2',
            media: 'https://example.com/imagen2.jpg'
          }
        ]
      };
      
      // Configurar la respuesta mock
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.SEARCH).reply(200, mockResponse);
      
      // Llamar al servicio
      const result = await newsCatcherService.searchNews('término de búsqueda');
      
      // Verificar el resultado
      expect(result).toEqual(mockResponse);
      expect(result.articles.length).toBe(2);
      expect(result.articles[0].title).toBe('Noticia 1');
    });
    
    test('debería incluir parámetros de consulta correctamente', async () => {
      // Datos de prueba
      const mockResponse = { status: 'ok', articles: [] };
      const searchTerm = 'término de búsqueda';
      const params = { from: '7d', countries: 'ES,MX', page_size: 5 };
      
      // Configurar la respuesta mock con verificación de parámetros
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.SEARCH).reply(config => {
        // Verificar que los parámetros se pasaron correctamente
        expect(config.params.q).toBe(searchTerm);
        expect(config.params.from).toBe(params.from);
        expect(config.params.countries).toBe(params.countries);
        expect(config.params.page_size).toBe(params.page_size);
        
        // También verificar que se incluyen los parámetros por defecto
        expect(config.params.lang).toBe(API_CONFIG.NEWSCATCHER.DEFAULT_PARAMS.lang);
        
        return [200, mockResponse];
      });
      
      // Llamar al servicio con parámetros
      await newsCatcherService.searchNews(searchTerm, params);
    });
    
    test('debería manejar errores correctamente', async () => {
      // Configurar la respuesta mock con error
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.SEARCH).reply(401, {
        status: 'error',
        message: 'Invalid API key'
      });
      
      // Esperar que la llamada al servicio lance un error
      await expect(newsCatcherService.searchNews('término')).rejects.toThrow();
    });
  });
  
  describe('getLatestHeadlines', () => {
    test('debería obtener titulares recientes correctamente', async () => {
      // Datos de prueba
      const mockResponse = {
        status: 'ok',
        total_hits: 2,
        articles: [
          { 
            title: 'Titular 1', 
            summary: 'Resumen del titular 1',
            published_date: '2025-05-14T10:00:00Z'
          },
          { 
            title: 'Titular 2', 
            summary: 'Resumen del titular 2',
            published_date: '2025-05-14T09:00:00Z'
          }
        ]
      };
      
      // Configurar la respuesta mock
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.LATEST_HEADLINES).reply(200, mockResponse);
      
      // Llamar al servicio
      const result = await newsCatcherService.getLatestHeadlines();
      
      // Verificar el resultado
      expect(result).toEqual(mockResponse);
      expect(result.articles.length).toBe(2);
    });
  });
  
  describe('getSources', () => {
    test('debería obtener fuentes correctamente', async () => {
      // Datos de prueba
      const mockResponse = {
        status: 'ok',
        sources: [
          { id: 'source1', name: 'Fuente 1', url: 'https://fuente1.com' },
          { id: 'source2', name: 'Fuente 2', url: 'https://fuente2.com' }
        ]
      };
      
      // Configurar la respuesta mock
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.SOURCES).reply(200, mockResponse);
      
      // Llamar al servicio
      const result = await newsCatcherService.getSources();
      
      // Verificar el resultado
      expect(result).toEqual(mockResponse);
      expect(result.sources.length).toBe(2);
    });
  });
  
  describe('getSimilarNews', () => {
    test('debería obtener noticias similares correctamente', async () => {
      // Datos de prueba
      const mockResponse = {
        status: 'ok',
        articles: [
          { title: 'Noticia Similar 1', summary: 'Resumen 1' },
          { title: 'Noticia Similar 2', summary: 'Resumen 2' }
        ]
      };
      
      const testUrl = 'https://example.com/noticia-original';
      
      // Configurar la respuesta mock
      mockAxios.onGet(API_CONFIG.NEWSCATCHER.ENDPOINTS.SIMILAR).reply(config => {
        // Verificar que la URL se pasó correctamente
        expect(config.params.url).toBe(testUrl);
        return [200, mockResponse];
      });
      
      // Llamar al servicio
      const result = await newsCatcherService.getSimilarNews(testUrl);
      
      // Verificar el resultado
      expect(result).toEqual(mockResponse);
      expect(result.articles.length).toBe(2);
    });
  });
});
