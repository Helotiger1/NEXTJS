import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


export function unflattenWithPrefix(flatObj: Record<string, any>): any {
  const result: any = {};

  for (const flatKey in flatObj) {
    const value = flatObj[flatKey];

    const keys = flatKey
      .replace(/\[(\d+)\]/g, '.$1') 
      .split('.');

    let current = result;

    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const isArrayIndex = !isNaN(Number(key));

      if (isLast) {
        current[key] = value;
      } else {
        if (!(key in current)) {
          current[key] = isArrayIndex ? [] : {};
        }
        current = current[key];
      }
    });
  }

  return result;
}

export function flattenDeepWithPrefix(obj: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};

  function recurse(current: any, currentPrefix: string) {
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        recurse(item, `${currentPrefix}[${index}]`);
      });
    } else if (current && typeof current === "object" && !Array.isArray(current)) {
      for (const key in current) {
        if (!Object.prototype.hasOwnProperty.call(current, key)) continue;

        const value = current[key];
        const newPrefix = currentPrefix ? `${currentPrefix}.${key}` : key;

        if (value !== null && typeof value === "object") {
          recurse(value, newPrefix);
        } else {
          result[newPrefix] = value;
        }
      }
    } else {
      // Si no es objeto ni array, lo asignamos directamente (en caso de raíz no válida)
      if (currentPrefix) {
        result[currentPrefix] = current;
      }
    }
  }

  recurse(obj, prefix);
  return result;
}

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toLowerCase();


    const methodsToFlatten = ['get', 'delete'];
    if (methodsToFlatten.includes(method || '') && config.params) {
      config.params = flattenDeepWithPrefix(config.params);
    }


    const methodsToUnflatten = ['post', 'put', 'patch'];
    if (methodsToUnflatten.includes(method || '') && config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
      config.data = unflattenWithPrefix(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item =>
        typeof item === 'object' && item !== null
          ? flattenDeepWithPrefix(item)
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
