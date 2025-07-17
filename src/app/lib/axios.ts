import axios from 'axios';



 export function convertirNumeros(value: any): any {
  if (Array.isArray(value)) {
    return value.map(convertirNumeros);
  }

  if (value !== null && typeof value === "object") {
    const result: any = {};
    for (const key in value) {
      result[key] = convertirNumeros(value[key]);
    }
    return result;
  }

  // Detecta strings numéricos simples: "42", "003", "5"
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function deepUnflatten(input: any): any {
  const isFlatKey = (key: string) => key.includes(".") || key.includes("[");

  const unflatten = (flatObj: Record<string, any>): any => {
    const result: any = {};

    for (const flatKey in flatObj) {
      const value = flatObj[flatKey];
      const keys = flatKey.replace(/\[(\d+)\]/g, ".$1").split(".");
      let current = result;

      keys.forEach((key, i) => {
        const isLast = i === keys.length - 1;
        const nextKey = keys[i + 1];
        const nextIsArrayIndex = /^\d+$/.test(nextKey);

        // Convierte key numérico a número
        const keyIsArrayIndex = /^\d+$/.test(key);
        const keyIndex = keyIsArrayIndex ? Number(key) : null;

        if (isLast) {
          if (keyIsArrayIndex) {
            if (!Array.isArray(current)) current = [];
            current[keyIndex!] = value;
          } else {
            current[key] = value;
          }
        } else {
          if (keyIsArrayIndex) {
            if (!Array.isArray(current)) {
              // Forzar array si no es
              current = [];
            }
            if (current[keyIndex!] === undefined) {
              current[keyIndex!] = nextIsArrayIndex ? [] : {};
            }
            current = current[keyIndex!];
          } else {
            if (!(key in current)) {
              current[key] = nextIsArrayIndex ? [] : {};
            }
            current = current[key];
          }
        }
      });
    }

    return result;
  };




  const traverse = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(traverse);
    }

    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const hasFlatKeys = Object.keys(obj).some(isFlatKey);
    const processed = hasFlatKeys ? unflatten(obj) : obj;

    const result: any = {};
    for (const key in processed) {
      result[key] = traverse(processed[key]);
    }

    return result;
  };

  return traverse(input);
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


      if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          if (user && user.id) {
            config.headers = {
              ...config.headers,
              'userId': user.id,
            };
          }
        } catch {
          console.log("nos jodimos")
        }
      }
    }

    const method = config.method?.toLowerCase();


    const methodsToFlatten = ['get', 'delete'];
    if (methodsToFlatten.includes(method || '') && config.params) {
      config.params = flattenDeepWithPrefix(config.params);
    }


    const methodsToUnflatten = ['post', 'put', 'patch'];
    if (methodsToUnflatten.includes(method || '') && config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
      config.data = deepUnflatten(config.data);
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
