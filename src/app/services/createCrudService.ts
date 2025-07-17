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

type ApiResponse<T> = {
  success: boolean;
  data: T;
};



export function createCrudService<TData, TResult = TData>(
  baseUrl: string
): CrudService<TData, TResult> {
  return {
    crear: (data: TResult) =>
      withErrorHandling(
        api.post<TData>(baseUrl, data).then(res => res.data)
      ),

    obtenerTodos: () =>
      withErrorHandling(
        api.get<TResult[]>(baseUrl).then(res => res.data)
      ),

    actualizar: (id: string, data: TResult) =>
      withErrorHandling(
        api.put<TData>(`${baseUrl}/${id}`, data).then(res => res.data)
      ),

    eliminar: (id: string) =>
      withErrorHandling(api.delete<void>(`${baseUrl}/${id}`).then(() => {})),
  };
}

export function manejarError(error: unknown) {
  let mensaje = "Error inesperado";

  if (axios.isAxiosError(error)) {
    if (error.response) {
      mensaje = error.response.data?.error || "Error en la respuesta del servidor";
      console.error("Error respuesta API:", error.response.status, mensaje);
    } else {
      mensaje = `Error en la petición: ${error.message}`;
      console.error("Error en configuración de petición:", error.message);
    }
  } else {
    console.error("Error inesperado:", error);
  }

  alert(mensaje);
}
