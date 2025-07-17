// src/app/lib/Validaciones_Envios.ts

export const estadosPermitidos = ['pendiente', 'enviado', 'entregado', 'cancelado'];
export const tiposPermitidos = ['barco', 'avion'];

/**
 * Valida que un valor sea una fecha válida (string o Date).
 */
export function validarFecha(valor: unknown, nombreCampo: string): string | null {
  if (!valor || (typeof valor !== 'string' && !(valor instanceof Date))) {
    return `${nombreCampo} es obligatorio y debe ser una fecha válida.`;
  }
  const fecha = new Date(valor as string);
  if (isNaN(fecha.getTime())) {
    return `${nombreCampo} no es una fecha válida.`;
  }
  return null;
}

/**
 * Valida que el estado sea uno de los permitidos.
 */
export function validarEstadoEnvio(estado: unknown): string | null {
  if (typeof estado !== 'string') {
    return 'El estado es obligatorio y debe ser texto.';
  }
  if (!estadosPermitidos.includes(estado.toLowerCase())) {
    return `Estado inválido. Valores permitidos: ${estadosPermitidos.join(', ')}`;
  }
  return null;
}

/**
 * Valida que el tipo sea uno de los permitidos.
 */
export function validarTipoEnvio(tipo: unknown): string | null {
  if (typeof tipo !== 'string') {
    return 'El tipo es obligatorio y debe ser texto.';
  }
  if (!tiposPermitidos.includes(tipo.toLowerCase())) {
    return `Tipo inválido. Valores permitidos: ${tiposPermitidos.join(', ')}`;
  }
  return null;
}

/**
 * Valida que un valor sea un número positivo.
 */
export function validarNumeroPositivo(valor: unknown, nombreCampo: string): string | null {
  if (typeof valor !== 'number' || valor <= 0) {
    return `${nombreCampo} debe ser un número positivo.`;
  }
  return null;
}

/**
 * Valida que un texto no esté vacío.
 */
export function validarTextoNoVacio(valor: unknown, nombreCampo: string): string | null {
  if (!valor || typeof valor !== 'string' || valor.trim() === '') {
    return `${nombreCampo} es obligatorio y debe ser texto no vacío.`;
  }
  return null;
}
