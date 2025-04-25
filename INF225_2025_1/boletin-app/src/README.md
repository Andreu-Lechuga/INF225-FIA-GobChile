# Código Fuente - Aplicación de Gestión de Boletines

Este directorio contiene el código fuente para el frontend de la aplicación de gestión de boletines, desarrollado con React y styled-components.

## Estructura del Directorio

- `assets/`: Recursos como estilos e imágenes
  - `styles/`: Hojas de estilo CSS
    - `index.css`: Estilos globales
- `components/`: Componentes reutilizables
  - `common/`: Componentes comunes
    - `Header.js`: Encabezado de la aplicación con información de usuario
    - `Footer.js`: Pie de página
    - `AuthHeader.js`: Encabezado para páginas de autenticación
  - `ui/`: Componentes de interfaz de usuario
    - `Button.js`: Componente de botón reutilizable
    - `Card.js`: Componente de tarjeta para contenido
    - `Container.js`: Contenedor para layout
    - `FormField.js`: Campo de formulario reutilizable
    - `Table.js`: Componente de tabla para datos
    - `Tag.js`: Componente para etiquetas
- `context/`: Contexto de React para el estado global
  - `index.js`: Implementación de BoletinesProvider y AuthProvider
- `pages/`: Páginas principales de la aplicación
  - `Auth/`: Páginas de autenticación
    - `Login.js`: Página de inicio de sesión
    - `SignUp.js`: Página de registro
  - `Home/`: Página principal con menú de navegación
  - `BoletinForm/`: Formulario para crear nuevos boletines
  - `BoletinList/`: Lista de boletines generados
  - `BoletinStatus/`: Tabla con el estado de los boletines
- `App.js`: Componente principal con rutas y protección de rutas
- `index.js`: Punto de entrada de la aplicación
- `reportWebVitals.js`: Medición de rendimiento

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **React Router**: Para la navegación entre páginas
- **Styled Components**: Para estilos con CSS-in-JS
- **Formik**: Para manejo de formularios
- **Yup**: Para validación de formularios
- **Axios**: Para peticiones HTTP al backend

## Estilos

Los estilos se manejan principalmente con styled-components, lo que permite tener estilos encapsulados por componente. También se utiliza un archivo de estilos globales (`assets/styles/index.css`) para definir estilos base y utilidades comunes.

Cada componente define sus propios estilos utilizando la sintaxis de styled-components, lo que facilita el mantenimiento y la reutilización.

## Navegación

La navegación se maneja con React Router v6, definiendo las rutas en el componente App.js:

### Rutas Públicas
- `/login`: Página de inicio de sesión
- `/signup`: Página de registro

### Rutas Protegidas (requieren autenticación)
- `/`: Página principal
- `/generar-boletin`: Formulario para crear boletines
- `/boletines`: Lista de boletines generados
- `/estado-boletines`: Estado de los boletines

Se implementa un componente `ProtectedRoute` que verifica si el usuario está autenticado antes de permitir el acceso a las rutas protegidas. Si el usuario no está autenticado, es redirigido a la página de login.

## Formularios

Los formularios se manejan con Formik y se validan con Yup, lo que permite una gestión eficiente de los estados del formulario y validaciones robustas.

### Formularios de Autenticación
- `Login.js`: Formulario de inicio de sesión con validación de campos
- `SignUp.js`: Formulario de registro con validación de campos y confirmación de contraseña

### Formularios de Boletines
- `BoletinForm/index.js`: Formulario para crear nuevos boletines con validación de campos

## Estado Global

El estado global de la aplicación se maneja a través de dos contextos de React:

### AuthProvider
Proporciona funcionalidades relacionadas con la autenticación:
- Registro de usuarios (`signup`)
- Inicio de sesión (`login`)
- Cierre de sesión (`logout`)
- Verificación de roles (`hasRole`)
- Estado de autenticación (`currentUser`, `loading`, `error`)

### BoletinesProvider
Proporciona funciones para la gestión de boletines:
- Agregar nuevos boletines (`agregarBoletin`)
- Obtener la lista de boletines (`obtenerBoletines`)
- Compartir el estado entre componentes

Ambos proveedores se combinan en un `AppProvider` que envuelve toda la aplicación, permitiendo acceder a ambos contextos desde cualquier componente.

## Componentes de Autenticación

### AuthHeader
Componente que muestra el encabezado en las páginas de autenticación, con el logo del Ministerio de Agricultura y el título.

### Login
Componente que implementa el formulario de inicio de sesión, con validación de campos y manejo de errores.

### SignUp
Componente que implementa el formulario de registro, con validación de campos, confirmación de contraseña y manejo de errores.

## Protección de Rutas

El componente `ProtectedRoute` en `App.js` se encarga de verificar si el usuario está autenticado antes de permitir el acceso a las rutas protegidas. Si el usuario no está autenticado, es redirigido a la página de login.

```jsx
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

Este componente se utiliza para envolver todas las rutas que requieren autenticación, asegurando que solo los usuarios autenticados puedan acceder a ellas.
