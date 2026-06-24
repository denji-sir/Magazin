import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Axios instance for LUMINA API
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: add JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: global error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const requestUrl = error.config?.url || '';
    const isAuthLoginRequest = requestUrl.includes('/auth/login/');

    if (status === 401) {
      if (!isAuthLoginRequest) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.error('Сессия истекла. Пожалуйста, войдите снова.');
      }
    } else if (status === 403) {
      toast.error('У вас нет прав для выполнения этого действия.');
    } else if (status === 404) {
      toast.error('Запрошенный ресурс не найден.');
    } else if (status === 422 || status === 400) {
      const message = error.response.data?.detail || error.response.data?.message || 'Ошибка валидации данных.';
      toast.error(message);
    } else if (status >= 500) {
      toast.error('Ошибка на стороне сервера. Мы уже работаем над исправлением.');
    } else if (!error.response) {
      toast.error('Нет связи с сервером. Проверьте интернет-соединение.');
    }

    return Promise.reject(error);
  }
);
