# Estructura de APIs para Boletín App

Esta carpeta contiene la estructura para manejar APIs externas en la aplicación de manera profesional y mantenible.

## Estructura de Directorios

```
api/
├── config/               # Configuración de APIs
│   ├── axios.js          # Configuración de instancias de Axios
│   └── apiConfig.js      # Configuraciones generales (URLs base, etc.)
├── services/             # Servicios específicos por API externa
│   └── apiService1.js    # Servicio para primera API externa
├── hooks/                # Custom hooks para consumir APIs
│   └── useApi.js         # Hook genérico para llamadas a API
└── interceptors/         # Interceptores para peticiones/respuestas
    ├── errorInterceptor.js  # Manejo centralizado de errores
    └── authInterceptor.js   # Manejo de autenticación en peticiones
```

## Cómo Utilizar

### 1. Configuración

Antes de utilizar las APIs, asegúrate de configurar las variables de entorno necesarias en el archivo `.env`:

```
# API URLs
REACT_APP_API1_URL=https://api1.example.com/v1
REACT_APP_API2_URL=https://api2.example.com/v2

# API Keys
REACT_APP_API1_KEY=tu_clave_api1_aqui
REACT_APP_API2_KEY=tu_clave_api2_aqui
```

### 2. Crear un Servicio de API

Para crear un nuevo servicio de API, crea un archivo en la carpeta `services/` siguiendo el patrón de `apiService1.js`:

```javascript
import axiosInstance from '../config/axios';
import { API_CONFIG } from '../config/apiConfig';

const BASE_URL = API_CONFIG.TU_API.BASE_URL;

export const tuApiService = {
  // Métodos para interactuar con la API
  getRecursos: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}${API_CONFIG.TU_API.ENDPOINTS.RECURSOS}`, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo recursos:', error);
      throw error;
    }
  },
  
  // Más métodos...
};

export default tuApiService;
```

### 3. Utilizar el Hook useApi

El hook `useApi` facilita el consumo de APIs en los componentes:

```javascript
import { useApi } from '../api/hooks/useApi';
import { tuApiService } from '../api/services/tuApiService';

const TuComponente = () => {
  // Uso básico
  const { data, loading, error, execute } = useApi(tuApiService.getRecursos);
  
  // Ejecutar al montar el componente
  const { data: datosAutomaticos } = useApi(
    tuApiService.getRecursos, 
    [], // dependencias
    true, // ejecutar al montar
    [{ categoria: 'noticias' }] // parámetros iniciales
  );
  
  const handleClick = () => {
    // Ejecutar manualmente con parámetros
    execute({ limit: 10, page: 1 });
  };
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={handleClick}>Cargar Datos</button>
      {data && (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 4. Configurar Interceptores

Para activar los interceptores, importa y ejecuta las funciones de configuración en tu archivo principal (por ejemplo, en `App.js`):

```javascript
import setupErrorInterceptor from './api/interceptors/errorInterceptor';
import setupAuthInterceptor from './api/interceptors/authInterceptor';

// Configurar interceptores
const removeErrorInterceptor = setupErrorInterceptor();
const removeAuthInterceptor = setupAuthInterceptor();

// Para eliminar los interceptores cuando sea necesario
// removeErrorInterceptor();
// removeAuthInterceptor();
```

### 5. Utilidades para APIs

En `utils/apiUtils.js` encontrarás funciones útiles para trabajar con APIs:

```javascript
import { cachedRequest, generateCacheKey, clearCache } from './utils/apiUtils';

// Ejemplo de uso de caché
const fetchDataWithCache = async () => {
  const cacheKey = generateCacheKey('/api/data', { page: 1 });
  
  const data = await cachedRequest(
    () => apiService.getData({ page: 1 }),
    cacheKey,
    60000 // TTL: 1 minuto
  );
  
  return data;
};

// Limpiar caché cuando sea necesario
clearCache(); // Limpiar toda la caché
clearCache('^/api/data'); // Limpiar solo entradas que coincidan con el patrón
```

## Testing

La estructura incluye directorios para diferentes tipos de tests:

- **Tests Unitarios**: `__tests__/unit/` - Para probar componentes, hooks y utilidades de forma aislada.
- **Tests de Integración**: `__tests__/integration/` - Para probar la integración entre servicios y APIs.
- **Tests End-to-End**: `__tests__/e2e/` - Para probar flujos completos de usuario.

Para ejecutar los tests:

```bash
npm test
```

## Mejores Prácticas

1. **Separación de Responsabilidades**: Mantén los servicios de API separados de la lógica de UI.
2. **Manejo de Errores**: Utiliza los interceptores para manejar errores de forma centralizada.
3. **Caché**: Utiliza las funciones de caché para optimizar las peticiones repetidas.
4. **Testing**: Escribe tests para cada nivel (unitarios, integración, e2e).
5. **Documentación**: Documenta los servicios y hooks con JSDoc.
