import axios from 'axios';
import authService from './authService';

const API_URL = ''; // Le préfixe /api est géré par le proxy Vite

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  timeout: 10000, // 10 secondes de timeout
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Requête API envoyée :', {
    url: `${config.baseURL}${config.url}`,
    method: config.method,
    headers: config.headers,
    data: config.data,
    params: config.params
  });
  return config;
}, (error) => {
  console.error('Erreur dans l\'intercepteur de requête API :', error);
  return Promise.reject(error);
});

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('Réponse API reçue :', {
      status: response.status,
      data: response.data,
      headers: response.headers,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error('Erreur API avec réponse :', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method
      });

      // Si l'erreur est 401 et que ce n'est pas une requête d'authentification
      if (error.response.status === 401 && 
          !error.config?.url?.includes('/login') && 
          !error.config?.url?.includes('/register')) {
        console.error('Erreur 401: Non authentifié ou token expiré. Effacement du token...');
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion si nécessaire
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Erreur API sans réponse (CORS possible) :', {
        message: error.message,
        request: error.request,
        url: error.config?.url
      });
    } else {
      console.error('Erreur API :', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 