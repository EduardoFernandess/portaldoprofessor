import axios from 'axios';
import { getToken } from '../services/storage';

// Por enquanto, estamos usando APIs fake, então baseURL não é crítico
// Em produção, substituiria pela URL real da API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Trata erros 401 não autorizados
    if (error.response?.status === 401) {
      // Token expirado ou inválido - poderia redirecionar para login aqui
      console.error('Acesso não autorizado');
    }
    return Promise.reject(error);
  }
);

export default api;

