/**
 * Configuración global de la API
 * 
 * Centraliza las URLs base y configuraciones del servidor.
 * Facilita cambios entre ambientes (desarrollo, producción, etc.)
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:8080',
  endpoints: {
    productos: '/productos'
  }
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.endpoints): string => {
  return API_CONFIG.baseUrl + API_CONFIG.endpoints[endpoint];
};
