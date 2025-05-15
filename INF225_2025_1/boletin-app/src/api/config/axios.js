import axios from 'axios';

// Instancia base de Axios con configuración común
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Instancia específica para Newscatcher API
export const newsCatcherAxios = axios.create({
  baseURL: process.env.REACT_APP_NEWSCATCHER_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_NEWSCATCHER_API_KEY
  }
});

// Configuración de interceptores globales
axiosInstance.interceptors.request.use(
  config => {
    // Puedes agregar lógica común para todas las peticiones
    // Por ejemplo, agregar un token de autenticación
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    // Procesar todas las respuestas exitosas
    return response;
  },
  error => {
    // Manejar errores comunes
    return Promise.reject(error);
  }
);

// También configuramos interceptores para la instancia de Newscatcher
newsCatcherAxios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Error en petición a Newscatcher API:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
