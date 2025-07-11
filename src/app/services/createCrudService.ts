import api from "@lib/axios";
import axios from "axios";

function withErrorHandling<T>(promise: Promise<T>): Promise<T> {
  return promise.catch(manejarError);
}

export interface CrudService<TData, TResult> {
  crear: (data: TResult) => Promise<TData>;
  obtenerTodos: () => Promise<TResult[]>; 
  actualizar: (id: string, data: TResult) => Promise<TData>;
  eliminar: (id: string) => Promise<void>;
}

export function createCrudService<TData, TResult>(
  baseUrl: string
): CrudService<TData, TResult> {
  return {
    crear: (data: TResult) =>
      withErrorHandling(
        api.post<TData>(baseUrl, data).then(res => res.data)
      ),

    obtenerTodos: () =>
      withErrorHandling(
        api.get<TData[]>(baseUrl).then(res =>
          res.data.map(item =>
            flattenDeepNoPrefix(item as Record<string, any>)
          ) as TResult[]
        )
      ),

    actualizar: (id: string, data: TResult) =>
      withErrorHandling(
        api.put<TData>(`${baseUrl}/${id}`, data).then(res => res.data)
      ),

    eliminar: (id: string) =>
      withErrorHandling(api.delete<void>(`${baseUrl}/${id}`).then(() => {})),
  };
}

export function manejarError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const mensaje =
        error.response.data?.error || "Error en la respuesta del servidor";
      console.error("Error respuesta API:", error.response.status, mensaje);
      throw new Error(mensaje);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor", error.request);
      throw new Error("No se recibió respuesta del servidor");
    } else {
      console.error("Error en configuración de petición:", error.message);
      throw new Error(`Error en la petición: ${error.message}`);
    }
  } else {
    console.error("Error inesperado:", error);
    throw new Error("Error inesperado");
  }
}

function flattenDeepNoPrefix(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenDeepNoPrefix(value));
    } else {
      result[key] = value;
    }
  }

  return result;
}
