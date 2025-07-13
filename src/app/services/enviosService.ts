import { createCrudService } from "./createCrudService";
import { paquete } from "./paqueteService";

export interface envioPayload{
    tipo : string;
    estado : string
    fechaLlegada?: string
    almacenOrigen: string;
    almacenEnvio: string;
    paquete : paquete[] 
}


export const envioService = createCrudService<paquete, envioPayload>("/envios/registrar")
