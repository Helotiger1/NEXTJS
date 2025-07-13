import { createCrudService } from "./createCrudService";
import { paquete } from "./paqueteService";

export interface envioPayload{
    tipo : string;
    estado : string
    almacenOrigen: string;
    almacenEnvio: string;
    paquete : paquete[] 
}

interface envio {
  cod: string;
  origen: string;
  destino: string;
  fechaLlegada: string;
  fechaSalida : string;
  tipo: string;
  estado: string;
}


export const envioEstadoService = createCrudService<envio, envioPayload>("/envios")
