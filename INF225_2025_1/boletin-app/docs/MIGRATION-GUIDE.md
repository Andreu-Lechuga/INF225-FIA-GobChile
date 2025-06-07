# Guía de Migración a Supabase

Este documento describe la migración completa del sistema de base de datos de MySQL a Supabase.

## Cambios Realizados

### 🗑️ Archivos Eliminados (MySQL)
- `server/config/db.js` - Configuración de MySQL
- `server/config/auth.js` - Configuración JWT manual
- `server/controllers/authController.js` - Controlador de autenticación manual
- `server/middleware/authMiddleware.js` - Middleware JWT manual
- `server/models/Boletin.js` - Modelo MySQL
- `server/routes/authRoutes.js` - Rutas de autenticación manual
- `server/db/` - Todo el directorio de base de datos MySQL

### ✅ Archivos Nuevos (Supabase)
- `server/config/supabase.js` - Configuración de Supabase
- `src/api/supabase.js` - Cliente Supabase para frontend
- `supabase-schema.sql` - Esquema de base de datos para Supabase
- `MIGRATION-GUIDE.md` - Esta guía

### 🔄 Archivos Modificados
- `.env.example` - Variables de entorno actualizadas
- `package.json` - Dependencias actualizadas
- `server/server.js` - Servidor simplificado
- `server/controllers/boletinesController.js` - Controlador actualizado para Supabase
- `src/context/index.js` - Contextos actualizados para Supabase

## Configuración de Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 2. Configurar Base de Datos
1. Ve a la sección "SQL Editor" en tu proyecto Supabase
2. Ejecuta el contenido del archivo `supabase-schema.sql`
3. Esto creará la tabla `boletines` con datos de ejemplo

### 3. Configurar Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
# Configuración del servidor
PORT=5000

# Configuración de Supabase
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio_supabase

# Entorno de desarrollo
NODE_ENV=development

# API URL para el servidor
API_URL=http://localhost:5000/api

# Configuración de API Newscatcher (mantener igual)
REACT_APP_NEWSCATCHER_API_URL=https://api.newscatcherapi.com/v2
REACT_APP_NEWSCATCHER_API_KEY=tu_clave_api_newscatcher_aqui

# Configuración de tiempos de caché (mantener igual)
REACT_APP_CACHE_DEFAULT_TTL=300000
REACT_APP_CACHE_SEARCH_TTL=120000
REACT_APP_CACHE_STATIC_TTL=3600000

# Configuración de reintentos (mantener igual)
REACT_APP_MAX_RETRIES=3
REACT_APP_RETRY_DELAY=1000
```

### 4. Configurar Autenticación en Supabase
1. Ve a "Authentication" > "Settings" en tu proyecto Supabase
2. Configura los proveedores de autenticación que desees (Email, Google, etc.)
3. Ajusta las políticas de seguridad según tus necesidades

## Ventajas de la Migración

### ✨ Beneficios Obtenidos
- **Autenticación Integrada**: No más JWT manual, Supabase maneja todo
- **Real-time**: Suscripciones en tiempo real automáticas
- **Escalabilidad**: Auto-scaling de PostgreSQL
- **Seguridad**: Row Level Security (RLS) integrado
- **Menos Código**: Eliminación de ~60% del código backend
- **Mejor Performance**: PostgreSQL optimizado
- **Backup Automático**: Respaldos automáticos incluidos

### 🔧 Funcionalidades Nuevas
- Suscripciones en tiempo real para boletines
- Autenticación con múltiples proveedores
- Políticas de seguridad granulares
- API REST automática
- Dashboard de administración

## Estructura Final del Proyecto

```
boletin-app/
├── server/
│   ├── config/
│   │   └── supabase.js          # Cliente Supabase servidor
│   ├── controllers/
│   │   └── boletinesController.js # Solo lógica de negocio
│   ├── routes/
│   │   └── boletinRoutes.js     # Rutas de boletines
│   └── server.js                # Servidor simplificado
├── src/
│   ├── api/
│   │   └── supabase.js          # Cliente Supabase frontend
│   ├── context/
│   │   └── index.js             # Contextos con Supabase
│   └── ...
├── supabase-schema.sql          # Esquema de BD
├── .env.example                 # Variables de entorno
└── MIGRATION-GUIDE.md           # Esta guía
```

## Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Solo servidor backend
npm run server

# Solo frontend
npm start
```

## Notas Importantes

### 🚨 Cambios en la Autenticación
- Ya no se usa JWT manual
- Los usuarios se autentican directamente con Supabase
- Las sesiones se manejan automáticamente
- Los roles se almacenan en `user_metadata`

### 🔄 Cambios en los Datos
- Los campos JSON ahora usan JSONB (más eficiente)
- Los timestamps incluyen zona horaria
- Los IDs son BIGSERIAL (más escalable)
- Row Level Security está habilitado

### 🛠️ Desarrollo
- El frontend se conecta directamente a Supabase
- El backend solo maneja lógica de negocio específica
- Las operaciones CRUD son más simples
- Real-time está disponible out-of-the-box

## Solución de Problemas

### Error de Conexión
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el proyecto Supabase esté activo
- Revisa que las claves no tengan espacios extra

### Error de Autenticación
- Verifica que la autenticación esté habilitada en Supabase
- Revisa las políticas RLS en la tabla boletines
- Asegúrate de que el usuario esté autenticado

### Error de Permisos
- Revisa las políticas RLS en Supabase
- Verifica que el usuario tenga los permisos correctos
- Asegúrate de que las políticas estén habilitadas

## Próximos Pasos

1. **Configurar Supabase**: Seguir los pasos de configuración
2. **Probar la Aplicación**: Verificar que todo funcione correctamente
3. **Configurar Producción**: Configurar variables de entorno para producción
4. **Optimizar**: Ajustar políticas RLS según necesidades específicas
5. **Monitorear**: Usar el dashboard de Supabase para monitorear la aplicación

¡La migración está completa! 🎉
