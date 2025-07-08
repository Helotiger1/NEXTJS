import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // baseURL opcional
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizado');
    }
    return Promise.reject(error);
  }
);

export default api;
