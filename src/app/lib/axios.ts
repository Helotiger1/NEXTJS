import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tu función flatten
function flattenDeepNoPrefix(obj: any): Record<string, any> {
  const result: Record<string, any> = {};

  function recurse(current: any) {
    if (Array.isArray(current)) {
      for (const item of current) {
        recurse(item);
      }
    } else if (current && typeof current === "object") {
      for (const key in current) {
        const value = current[key];
        if (
          value &&
          (typeof value === "object" || Array.isArray(value))
        ) {
          recurse(value);
        } else {
          result[key] = value;
        }
      }
    }
  }

  recurse(obj);
  return result;
}

// Interceptor de petición: aplana params de GET/DELETE
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const methodsToFlatten = ['get', 'delete'];
    const method = config.method?.toLowerCase();
    if (methodsToFlatten.includes(method || '') && config.params) {
      config.params = flattenDeepNoPrefix(config.params);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: aplana cada objeto si response.data es un array
api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item =>
        typeof item === 'object' && item !== null
          ? flattenDeepNoPrefix(item)
          : item
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Sesión expirada o no autorizado');
    }
    return Promise.reject(error);
  }
);

export default api;
