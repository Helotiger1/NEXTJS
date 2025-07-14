"use client"
import { createCrudService } from "./createCrudService";
export interface clientes {
    codigo?: string;
    telefono: string;
    linea1: String;
    linea2: String;
    pais: String;
    estado: String;
    ciudad: String;
    codigoPostal: string;
}



export const clienteService = createCrudService<clientes>(
    "/usuarios?rol=CLIENTE"
);
