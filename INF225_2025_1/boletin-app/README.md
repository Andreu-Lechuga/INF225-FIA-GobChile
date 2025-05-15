# Aplicación de Gestión de Boletines

Esta es una aplicación web desarrollada con React y Node.js para la gestión de boletines del Ministerio de Agricultura, con sistema de autenticación y base de datos MySQL.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- `public/`: Archivos estáticos
  - `images/`: Imágenes utilizadas en la aplicación (logo del Ministerio)
  - `index.html`: Plantilla HTML principal
  - `manifest.json`: Configuración para PWA
- `src/`: Código fuente del frontend
  - `__tests__/`: Pruebas automatizadas
    - `unit/`: Pruebas unitarias
      - `hooks/`: Pruebas de hooks personalizados
        - `useApi.test.js`: Pruebas para el hook de API
      - `components/`: Pruebas de componentes
      - `utils/`: Pruebas de utilidades
    - `integration/`: Pruebas de integración
      - `api/`: Pruebas de integración de servicios API
        - `apiService1.test.js`: Pruebas del servicio API principal
        - `newsCatcherService.test.js`: Pruebas del servicio de noticias
    - `e2e/`: Pruebas end-to-end
      - `flows/`: Flujos completos de usuario
        - `resourceFlow.test.js`: Prueba del flujo completo de recursos
  - `api/`: Configuración y servicios de API
    - `config/`: Configuraciones de API
      - `apiConfig.js`: Configuración general de APIs
      - `axios.js`: Configuración de instancia Axios
    - `hooks/`: Hooks personalizados para API
      - `useApi.js`: Hook genérico para llamadas a API
      - `useNewsCatcher.js`: Hook específico para API de noticias
    - `interceptors/`: Interceptores de Axios
      - `authInterceptor.js`: Interceptor para autenticación
      - `errorInterceptor.js`: Interceptor para manejo de errores
    - `services/`: Servicios de API
      - `apiService1.js`: Servicio principal de API
      - `newsCatcherService.js`: Servicio para API de noticias
  - `assets/`: Recursos como estilos e imágenes
    - `styles/`: Hojas de estilo CSS
      - `index.css`: Estilos globales
  - `components/`: Componentes reutilizables
    - `common/`: Componentes comunes
      - `Header.js`: Encabezado de la aplicación
      - `Footer.js`: Pie de página
      - `AuthHeader.js`: Encabezado para páginas de autenticación
    - `ui/`: Componentes de interfaz de usuario
      - `Button.js`, `Card.js`, `Container.js`, etc.
  - `context/`: Contexto de React para el estado global
    - `index.js`: Implementación de BoletinesProvider y AuthProvider
  - `pages/`: Páginas principales de la aplicación
    - `Auth/`: Páginas de autenticación
      - `Login.js`: Página de inicio de sesión
      - `SignUp.js`: Página de registro
    - `Home/`: Página principal
    - `BoletinForm/`: Formulario para crear boletines
    - `BoletinList/`: Lista de boletines
    - `BoletinStatus/`: Estado de los boletines
  - `utils/`: Utilidades y funciones auxiliares
    - `apiUtils.js`: Utilidades para manejo de API (caché, reintentos, etc.)
  - `App.js`: Componente principal con rutas y protección de rutas
  - `index.js`: Punto de entrada de la aplicación
  - `reportWebVitals.js`: Medición de rendimiento
- `server/`: Backend de la aplicación
  - `config/`: Configuraciones
    - `auth.js`: Configuración de autenticación JWT
    - `db.js`: Configuración de conexión a MySQL
  - `controllers/`: Controladores
    - `authController.js`: Controlador de autenticación
    - `boletinesController.js`: Controlador de boletines
  - `db/`: Scripts de base de datos
    - `init.js`: Inicialización de la base de datos
    - `boletines_db.sql`: Esquema SQL
  - `middleware/`: Middleware
    - `authMiddleware.js`: Middleware de autenticación
  - `routes/`: Rutas API
    - `authRoutes.js`: Rutas de autenticación
  - `server.js`: Punto de entrada del servidor

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca para construir interfaces de usuario
- **React Router**: Para la navegación entre páginas
- **Styled Components**: Para estilos con CSS-in-JS
- **Formik**: Para manejo de formularios
- **Yup**: Para validación de formularios
- **Axios**: Para peticiones HTTP
- **Jest**: Framework de pruebas
- **React Testing Library**: Utilidades para pruebas de componentes React
- **Axios Mock Adapter**: Para simular respuestas de API en pruebas

### Backend
- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework para aplicaciones web
- **MySQL**: Base de datos relacional
- **JWT**: JSON Web Tokens para autenticación
- **Bcrypt**: Para el hash de contraseñas

## Requisitos Previos

- Node.js (versión 14.x o superior)
- npm (versión 6.x o superior)
- MySQL (versión 5.7 o superior)

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Ajusta los valores en el archivo `.env` según tu entorno local

```bash
cp .env.example .env
```

4. Configura la base de datos MySQL:
   - Crea una base de datos llamada `boletin_app`
   - Asegúrate de que el usuario MySQL tenga los permisos necesarios
   - Ajusta la configuración en `.env` con tus credenciales de base de datos

5. Inicializa la base de datos:

```bash
npm run init-db
```

## Control de Versiones y Configuración

### .gitignore

El proyecto incluye un archivo `.gitignore` que excluye del repositorio:

- Carpeta `node_modules/` (dependencias)
- Archivos de construcción (`/build`, `/dist`)
- Archivos de entorno (`.env`, `.env.local`, etc.)
- Logs y archivos temporales
- Archivos específicos del sistema operativo y editores

Esto asegura que solo se versionen los archivos necesarios para el desarrollo, manteniendo el repositorio limpio y evitando conflictos entre diferentes entornos.

### Variables de Entorno

Las variables de entorno se gestionan mediante archivos `.env`:

- `.env.example`: Plantilla con la estructura de variables necesarias (incluida en el repositorio)
- `.env`: Archivo con los valores reales (no incluido en el repositorio)

Este enfoque permite:
- Mantener configuraciones sensibles fuera del control de versiones
- Facilitar la configuración en diferentes entornos (desarrollo, pruebas, producción)
- Proporcionar documentación sobre las variables necesarias

## Ejecución en Desarrollo

Para iniciar solo el frontend:

```bash
npm start
```

Para iniciar solo el backend:

```bash
npm run server
```

Para iniciar tanto el frontend como el backend simultáneamente:

```bash
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000) y el backend en [http://localhost:5000](http://localhost:5000).

## Construcción para Producción

Para construir el frontend para producción:

```bash
npm run build
```

Esto generará una versión optimizada de la aplicación en la carpeta `build/`.

Para desplegar en producción, necesitarás configurar un servidor web para servir los archivos estáticos del frontend y ejecutar el backend en un entorno de producción.

## Características Implementadas

### Frontend
- **Navegación**: Sistema de rutas con React Router
- **Autenticación**: Sistema de login y registro de usuarios
- **Página de inicio**: Menú principal con acceso a todas las funcionalidades
- **Formulario de boletines**: Interfaz para crear nuevos boletines con validación
- **Lista de boletines**: Visualización de boletines generados
- **Estado de boletines**: Tabla con información detallada del estado de los boletines
- **Gestión de estado**: Contexto de React para manejar el estado global de la aplicación
- **Componentes reutilizables**: Botones, tarjetas, contenedores y otros elementos UI
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **Protección de rutas**: Acceso restringido a rutas basado en autenticación

### Backend
- **API RESTful**: Endpoints para gestionar boletines y autenticación
- **Autenticación JWT**: Sistema de tokens para autenticación segura
- **Base de datos MySQL**: Almacenamiento persistente de datos
- **Middleware de autenticación**: Protección de rutas sensibles
- **Sistema de roles**: Diferentes niveles de acceso (jefe, empleado, usuario público)

## Estructura de Navegación

### Rutas Públicas
- `/login`: Página de inicio de sesión
- `/signup`: Página de registro

### Rutas Protegidas (requieren autenticación)
- `/`: Página principal con menú
- `/generar-boletin`: Formulario para crear boletines
- `/boletines`: Lista de boletines generados
- `/estado-boletines`: Estado de los boletines

## API Endpoints

### Autenticación
- `POST /api/auth/register`: Registro de nuevos usuarios
- `POST /api/auth/login`: Inicio de sesión
- `GET /api/auth/profile`: Obtener perfil del usuario autenticado

### Boletines (pendientes de implementar)
- `GET /api/boletines`: Obtener todos los boletines
- `GET /api/boletines/:id`: Obtener un boletín específico
- `POST /api/boletines`: Crear un nuevo boletín
- `PUT /api/boletines/:id`: Actualizar un boletín
- `DELETE /api/boletines/:id`: Eliminar un boletín
