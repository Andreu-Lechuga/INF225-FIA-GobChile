/**
 * Utilidades para el manejo de errores en la aplicación
 */

// Función para extraer un mensaje de error legible de cualquier tipo de error
export const getErrorMessage = (error) => {
  if (!error) return 'Error desconocido';
  
  // Si es un string, devolverlo directamente
  if (typeof error === 'string') return error;
  
  // Si es un error de Supabase
  if (error.message) {
    // Errores específicos de Supabase
    if (error.code) {
      switch (error.code) {
        case 'PGRST116':
          return 'No se encontró el registro solicitado';
        case 'PGRST301':
          return 'Error de autenticación. Por favor, inicia sesión nuevamente';
        case '23505':
          return 'Ya existe un registro con estos datos';
        case '23503':
          return 'No se puede eliminar este registro porque está siendo usado por otros datos';
        case '42P01':
          return 'Error de configuración de la base de datos';
        default:
          return error.message;
      }
    }
    return error.message;
  }
  
  // Si es un error de red
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return data?.message || 'Solicitud inválida';
      case 401:
        return 'No autorizado. Por favor, inicia sesión';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error interno del servidor';
      case 503:
        return 'Servicio no disponible temporalmente';
      default:
        return data?.message || `Error del servidor (${status})`;
    }
  }
  
  // Si es un error de conexión
  if (error.request) {
    return 'Error de conexión. Verifica tu conexión a internet';
  }
  
  // Para cualquier otro tipo de error, intentar convertirlo a string
  try {
    return JSON.stringify(error);
  } catch {
    return 'Error desconocido';
  }
};

// Función para mostrar errores al usuario de forma amigable
export const showUserError = (error, defaultMessage = 'Ha ocurrido un error') => {
  const message = getErrorMessage(error);
  
  // Aquí puedes integrar con tu sistema de notificaciones
  // Por ahora, usaremos console.error y alert como fallback
  console.error('Error:', error);
  
  // Si tienes un sistema de toast/notificaciones, úsalo aquí
  // toast.error(message);
  
  return message;
};

// Función para logging detallado de errores
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: {
      message: getErrorMessage(error),
      stack: error?.stack,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data
    }
  };
  
  console.error('Error detallado:', errorInfo);
  
  // Aquí puedes enviar el error a un servicio de logging como Sentry
  // Sentry.captureException(error, { extra: errorInfo });
  
  return errorInfo;
};

// Wrapper para operaciones asíncronas con manejo de errores
export const withErrorHandling = async (operation, context = '') => {
  try {
    return await operation();
  } catch (error) {
    logError(error, context);
    throw new Error(getErrorMessage(error));
  }
};

// Función específica para errores de Supabase
export const handleSupabaseError = (error, operation = '') => {
  const context = `Operación Supabase: ${operation}`;
  logError(error, context);
  
  const userMessage = getErrorMessage(error);
  return {
    success: false,
    error: userMessage,
    originalError: error
  };
};

export default {
  getErrorMessage,
  showUserError,
  logError,
  withErrorHandling,
  handleSupabaseError
};
