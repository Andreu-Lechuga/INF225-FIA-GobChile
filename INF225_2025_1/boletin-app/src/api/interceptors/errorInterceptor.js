import axiosInstance from '../config/axios';

/**
 * Configura el interceptor para manejar errores de manera centralizada
 * @returns {Function} - Función para desactivar el interceptor
 */
const setupErrorInterceptor = () => {
  // ID del interceptor para poder eliminarlo si es necesario
  const interceptorId = axiosInstance.interceptors.response.use(
    // Para respuestas exitosas, simplemente las dejamos pasar
    response => response,
    // Para errores, los manejamos según el tipo
    error => {
      // Si hay una respuesta del servidor (error HTTP)
      if (error.response) {
        const { status, data } = error.response;
        
        // Manejar diferentes códigos de error
        switch (status) {
          case 400:
            console.error('Error de solicitud:', data?.message || 'Datos inválidos');
            break;
          case 401:
            console.error('Error de autenticación: No autorizado');
            // Aquí podrías redirigir al login o refrescar el token
            break;
          case 403:
            console.error('Acceso prohibido: No tienes permisos para este recurso');
            break;
          case 404:
            console.error('Recurso no encontrado');
            break;
          case 429:
            console.error('Demasiadas peticiones. Intenta más tarde');
            // Aquí podrías implementar una lógica de reintento con backoff
            break;
          case 500:
            console.error('Error del servidor:', data?.message || 'Error interno del servidor');
            break;
          default:
            console.error(`Error inesperado (${status}):`, data?.message || 'Error desconocido');
        }
      } 
      // Si la solicitud se hizo pero no se recibió respuesta
      else if (error.request) {
        console.error('No se recibió respuesta del servidor. Verifica tu conexión a internet');
      } 
      // Si ocurrió un error al configurar la petición
      else {
        console.error('Error al configurar la petición:', error.message);
      }
      
      // Registrar información adicional para depuración
      if (process.env.NODE_ENV === 'development') {
        console.debug('Detalles completos del error:', error);
      }
      
      // Siempre rechazamos la promesa para que el código que llama pueda manejar el error
      return Promise.reject(error);
    }
  );

  // Devolvemos una función para eliminar el interceptor si es necesario
  return () => {
    axiosInstance.interceptors.response.eject(interceptorId);
  };
};

export default setupErrorInterceptor;
