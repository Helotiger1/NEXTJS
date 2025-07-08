import { createCrudService } from "./createCrudService";
export interface Usuario {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  contraseña: string;
  rol: "ADMIN" | "USUARIO" | "CLIENTE"; }


export const usuarioService = createCrudService<Usuario>("/usuarios");
