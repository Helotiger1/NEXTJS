import { createCrudService } from "./createCrudService";
import { paquete } from "./paqueteService";

interface envioPayload{
    tipo : string;
    estado : string
    fechaSalida?: string
    fechaLlegada?: string
    almacenOrigen: string;
    almacenEnvio: string;
    paquete : paquete[] 
}


export const envioSerice = createCrudService<paquete, envioPayload>("/envios")
