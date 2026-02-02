import axios from "axios";

// Configuración de URLs de las APIs desde variables de entorno
export const API_NEST =
  import.meta.env.VITE_API_NEST || "http://localhost:3000/api";
export const API_PHP = import.meta.env.VITE_API_PHP || "http://localhost:8080";

// Cliente Axios para API NestJS (Cliente)
export const nestApi = axios.create({
  baseURL: API_NEST,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cliente Axios para API PHP (Admin)
export const phpApi = axios.create({
  baseURL: API_PHP,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores global
const errorHandler = (error) => {
  if (error.response) {
    console.error("Error de respuesta:", error.response.data);
  } else if (error.request) {
    console.error("Error de red:", error.request);
  } else {
    console.error("Error:", error.message);
  }
  return Promise.reject(error);
};

nestApi.interceptors.response.use((response) => response, errorHandler);
phpApi.interceptors.response.use((response) => response, errorHandler);
