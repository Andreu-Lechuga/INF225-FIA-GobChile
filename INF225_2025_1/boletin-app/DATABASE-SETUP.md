# Configuración de Base de Datos - Boletín App

## Inicialización Automática

La aplicación está configurada para inicializar automáticamente la base de datos cuando ejecutes `npm run dev`. Sin embargo, necesitas asegurarte de que la tabla `boletines` exista en Supabase.

## Pasos de Configuración

### 1. Crear la tabla en Supabase (Solo si no existe)

Si la tabla `boletines` no existe en tu base de datos Supabase:

1. Ve a tu [Dashboard de Supabase](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta el contenido del archivo `init-table.sql`:

```sql
-- Crear tabla boletines con la estructura correcta
CREATE TABLE IF NOT EXISTS boletines (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    temas JSONB NOT NULL,
    conceptos JSONB DEFAULT NULL,
    links_busqueda JSONB DEFAULT NULL,
    plazo VARCHAR(10) NOT NULL,
    comentarios VARCHAR(200) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'En Revision',
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resultados_api JSONB DEFAULT NULL,
    
    -- Constraints para validación
    CONSTRAINT chk_estado CHECK (estado IN ('En Revision', 'Rechazado', 'Aprobado', 'Completado')),
    CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
);
```

### 2. Ejecutar la aplicación

Una vez que la tabla existe, simplemente ejecuta:

```bash
npm run dev
```

## ¿Qué sucede automáticamente?

Cuando ejecutas `npm run dev`, la aplicación:

1. **Verifica la conexión** a Supabase
2. **Comprueba si la tabla existe** y tiene datos
3. **Inserta 3 boletines de ejemplo** si la tabla está vacía:
   - Agricultura Sostenible 2025
   - Control Biológico de Plagas en Cultivos  
   - Sistemas de Riego Eficiente y Conservación

## Estructura de los Boletines de Ejemplo

Cada boletín incluye:
- **Título**: Descriptivo del tema
- **Temas**: Array JSON con categorías principales
- **Conceptos**: Array JSON con términos de búsqueda en inglés
- **Links de búsqueda**: Array JSON con URLs de fuentes académicas
- **Plazo**: Duración del proyecto (3_meses, 6_meses, 1_año)
- **Comentarios**: Descripción del objetivo
- **Estado**: En Revision, Aprobado, o Completado
- **Fecha de registro**: Fechas escalonadas (hace 2, 5 y 10 días)

## Mensajes de Consola

Al iniciar el servidor, verás mensajes como:

```
🚀 Iniciando verificación de base de datos...
✅ Tabla boletines ya existe y tiene datos
🎉 Inicialización de base de datos completada
Servidor ejecutándose en http://localhost:5000
```

O si necesita insertar datos:

```
🚀 Iniciando verificación de base de datos...
📝 Tabla vacía detectada, insertando datos de ejemplo...
📝 Insertando boletines de ejemplo...
✅ 3 boletines de ejemplo insertados exitosamente
🎉 Inicialización de base de datos completada
```

## Solución de Problemas

### Error: Tabla no existe
Si ves errores sobre que la tabla no existe, ejecuta el script `init-table.sql` en Supabase.

### Error: Variables de entorno
Asegúrate de tener configurado tu archivo `.env.local` con:
```
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Reiniciar datos
Si quieres reiniciar completamente la base de datos, puedes ejecutar el script `reset-database.sql` en Supabase.

## Archivos Relacionados

- `init-table.sql`: Script mínimo para crear la tabla
- `reset-database.sql`: Script completo para reiniciar todo
- `server/config/initDatabase.js`: Lógica de inicialización automática
- `server/server.js`: Punto de entrada que ejecuta la inicialización
