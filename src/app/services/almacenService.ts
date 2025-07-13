"use client"
import { createCrudService } from "./createCrudService";
export interface almacen {
    codigo?: string;
    telefono: string;
    linea1: String;
    linea2: String;
    pais: String;
    estado: String;
    ciudad: String;
    codigoPostal: string;
}



export const almacenService = createCrudService<almacen>(
    "/almacenes"
);
