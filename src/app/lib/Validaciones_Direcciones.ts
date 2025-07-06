// src/app/lib/Validaciones_Direcciones.ts

export interface DireccionInput {
  linea1: string;
  linea2?: string;
  pais: string;
  estado: string;
  ciudad: string;
  codigoPostal: number;
}

// Validaciones para direcciones
export function validarDireccion(direccion: DireccionInput): string | null {
  if (!direccion.linea1 || direccion.linea1.trim() === '') {
    return 'La línea 1 de la dirección es obligatoria';
  }
  if (!direccion.pais || direccion.pais.trim() === '') {
    return 'El país es obligatorio';
  }
  if (!direccion.estado || direccion.estado.trim() === '') {
    return 'El estado es obligatorio';
  }
  if (!direccion.ciudad || direccion.ciudad.trim() === '') {
    return 'La ciudad es obligatoria';
  }
  if (!direccion.codigoPostal || typeof direccion.codigoPostal !== 'number' || direccion.codigoPostal <= 0) {
    return 'El código postal debe ser un número positivo';
  }
  return null; // todo bien
}
