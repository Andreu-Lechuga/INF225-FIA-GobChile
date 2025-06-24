# Integración de la API de NewsCatcher - Documentación

## Resumen de Cambios Implementados

Se ha completado la integración de la API de NewsCatcher en el formulario BoletinForm para realizar búsquedas de noticias basadas en los parámetros seleccionados por el usuario.

## Archivos Modificados

### 1. `src/pages/BoletinForm/index.js`

**Cambios principales:**
- ✅ Importación del servicio NewsCatcher
- ✅ Agregados estados para manejar la API (loading, error, results)
- ✅ Implementada la llamada a la API en `handleSubmit` 
- ✅ Agregado feedback visual para el usuario
- ✅ Mapeo correcto de fuentes seleccionadas (IDs → nombres)

**Flujo de datos implementado:**
1. **Fuentes seleccionadas**: `fuentesSeleccionadas` (array de IDs) → convertidos a nombres de categorías
2. **Temas seleccionados**: `selectedTags` → `conceptToCustomTags` → query en inglés
3. **Período de búsqueda**: `values.span` → cálculo de fechas `from` y `to`

### 2. `src/api/services/newsCatcherService.js`

**Cambios principales:**
- ✅ Agregado comentario de sincronización con BoletinForm
- ✅ Verificada compatibilidad de nombres de categorías

## Variables Utilizadas Correctamente

### ✅ Custom Tags (Temas)
- Los temas seleccionados se convierten automáticamente a términos en inglés usando `conceptToCustomTags`
- Se construye una query con operador OR: `"Tillage techniques" OR "Soil preparation" OR ...`

### ✅ Custom Links (Fuentes)
- Las fuentes seleccionadas se mapean correctamente a las URLs definidas en `sourcesByType`
- Categorías disponibles: "Académicas", "Científicas", "Gubernamentales", "Noticias"

### ✅ Período de Búsqueda
- Se calcula correctamente las fechas `from` y `to` basadas en la selección
- Opciones: 3 meses, 6 meses, 1 año, 3 años, 5 años
- Por defecto: 3 meses

## Configuración de la API

### Idioma Principal
- ✅ Configurado en **español** (`lang: 'es'`)
- Países incluidos: Chile, España, México, Argentina, Colombia, Perú

### Parámetros de Búsqueda
```javascript
{
  lang: 'es',
  countries: 'CL,ES,MX,AR,CO,PE',
  from: '2024-03-24', // Calculado dinámicamente
  to: '2024-06-24',   // Fecha actual
  search_in: 'title,summary,content',
  sort_by: 'relevancy',
  sources: 'scielo.org,redalyc.org,...', // URLs de fuentes seleccionadas
  ranked_only: true,
  page_size: 20
}
```

## Estados de la Interfaz

### Estados Implementados
- `apiLoading`: Muestra spinner durante la búsqueda
- `apiError`: Muestra mensajes de error
- `searchResults`: Almacena y muestra resultados

### Feedback Visual
- **Cargando**: Spinner + mensaje "Buscando artículos relevantes..."
- **Error**: Mensaje de error en rojo con detalles
- **Éxito**: Mensaje verde con número de artículos encontrados y preview

## Ejemplo de Uso

1. **Usuario selecciona fuentes**: "Científicas", "Académicas"
2. **Usuario selecciona temas**: "Riego por Goteo", "Cultivos Hidropónicos"
3. **Usuario selecciona período**: "6 meses"

**Resultado de la conversión:**
```javascript
// Query generada
query = "Drip irrigation OR Micro-irrigation OR Trickle systems OR Hydroponic systems OR Soilless cultivation OR Water-based farming"

// Fuentes utilizadas
sources = "scielo.org,redalyc.org,dialnet.unirioja.es,fao.org,inia.cl,agronomia.uchile.cl,sciencedirect.com,springer.com,mdpi.com"

// Período
from = "2023-12-24"
to = "2024-06-24"
```

## Variables de Entorno Requeridas

Asegúrate de configurar en tu archivo `.env.local`:

```env
REACT_APP_NEWSCATCHER_API_URL=https://api.newscatcherapi.com/v2
REACT_APP_NEWSCATCHER_API_KEY=tu_clave_api_newscatcher_aqui
```

## Próximos Pasos

Para completar la integración, considera implementar:

1. **Procesamiento de resultados**: Guardar artículos encontrados en la base de datos
2. **Paginación**: Manejar múltiples páginas de resultados
3. **Filtros adicionales**: Agregar más opciones de filtrado
4. **Cache**: Implementar cache para evitar llamadas repetidas
5. **Análisis de contenido**: Procesar y analizar los artículos encontrados

## Debugging

Para verificar que la integración funciona correctamente:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Completa el formulario y envía
4. Verifica los logs:
   - "Iniciando búsqueda en NewsCatcher API..."
   - "Query: [términos de búsqueda]"
   - "Fuentes seleccionadas: [IDs]"
   - "Tipos de fuentes (nombres): [nombres]"
   - "Resultados de la búsqueda: [objeto con resultados]"

## Manejo de Errores

La implementación incluye manejo robusto de errores:
- Errores de red
- Errores de autenticación de API
- Errores de validación de parámetros
- Timeouts de conexión

Todos los errores se muestran al usuario de forma clara y se registran en la consola para debugging.
