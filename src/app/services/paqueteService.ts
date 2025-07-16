import { createCrudService } from "./createCrudService";

export interface paquete {
  tracking?: string;
  descripcion: string;
  almacenOrigen: string;
  almacenDestino: string;
  peso: string;
  largo: number
  alto: number;
  ancho: number
  fecha: Date;
  cedula: string;
  estado?: "EN_CAMINO" | "ENTREGADO" | "PENDIENTE";
}

export interface paquetePayload extends paquete{
  cedulaDestino : string;
  cedulaOrigen : string;
  tipoEnvio : "BARCO" | "AVION";
}




export const paqueteService = createCrudService<paquete, paquetePayload>('/paquetes')