import { createCrudService } from "./createCrudService";
export interface Almacen {
    codigo: string;
    telefono: string;
    direccion: {
        linea1: String;
        linea2: String;
        pais: String;
        estado: String;
        ciudad: String;
        codigoPostal: string;
    };
}

export type AlmacenPayload = Omit<Almacen, "id">; // o Partial<Almacen> si todo es opcional

export const almacenService = createCrudService<Almacen, AlmacenPayload>(
    "/almacenes"
);
