import axiosInstance from '../config/axios';

/**
 * Configura el interceptor para manejar la autenticación en las peticiones
 * @returns {Function} - Función para desactivar el interceptor
 */
const setupAuthInterceptor = () => {
  // ID del interceptor para poder eliminarlo si es necesario
  const interceptorId = axiosInstance.interceptors.request.use(
    config => {
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem('authToken');
      
      // Si hay un token, lo agregamos al encabezado de autorización
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      
      return config;
    },
    error => {
      // Si hay un error en la configuración de la petición
      console.error('Error en la configuración de la petición:', error);
      return Promise.reject(error);
    }
  );

  // Devolvemos una función para eliminar el interceptor si es necesario
  return () => {
    axiosInstance.interceptors.request.eject(interceptorId);
  };
};

export default setupAuthInterceptor;
