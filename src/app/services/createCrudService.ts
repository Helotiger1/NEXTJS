import api from "@lib/axios";
import axios, { AxiosError } from "axios";

function withErrorHandling<T>(promise: Promise<T>): Promise<T> {
  return promise.catch((error) => {
    manejarError(error);
  });
}

export function createCrudService<TData, TPayload = Partial<TData>>(baseUrl: string) {
  return {
    crear: (data: TPayload) =>
      withErrorHandling(api.post<TData>(baseUrl, data).then(res => res.data)),

    obtenerTodos: () =>
      withErrorHandling(api.get<TData[]>(baseUrl).then(res => res.data)),

    actualizar: (id: string, data: TPayload) =>
      withErrorHandling(api.put<TData>(`${baseUrl}/${id}`, data).then(res => res.data)),

    eliminar: (id: string) =>
      withErrorHandling(api.delete<void>(`${baseUrl}/${id}`).then(() => {})),
  };
}




export function manejarError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const mensaje = error.response.data?.error || 'Error en la respuesta del servidor';
      console.error("Error respuesta API:", error.response.status, mensaje);
      throw new Error(mensaje); // Ahora lanza solo el mensaje útil del backend
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

