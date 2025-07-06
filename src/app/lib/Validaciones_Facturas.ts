// Validaciones_Facturas.ts

/**
 * Valida que una fecha sea válida y esté en formato correcto.
 * @param fecha - La fecha en formato string.
 * @param campo - Nombre del campo que se está validando (para mensajes de error).
 * @returns Mensaje de error o null si es válida.
 */
export function validarFecha(fecha: string, campo: string): string | null {
  if (!fecha || isNaN(Date.parse(fecha))) {
    return `Fecha inválida en ${campo}`;
  }
  return null;
}

/**
 * Valida que el estado de una factura sea válido.
 * @param estado - Estado a validar.
 * @returns Mensaje de error o null si es válido.
 */
export function validarEstadoFactura(estado: string): string | null {
  const estadosValidos = ['pendiente', 'pagada', 'cancelada'];
  if (!estadosValidos.includes(estado.toLowerCase())) {
    return 'Estado de factura inválido';
  }
  return null;
}

/**
 * Valida que el método de pago sea válido.
 * @param metodo - Método de pago a validar.
 * @returns Mensaje de error o null si es válido.
 */
export function validarMetodoPago(metodo: string): string | null {
  const metodosValidos = ['efectivo', 'tarjeta', 'transferencia'];
  if (!metodosValidos.includes(metodo.toLowerCase())) {
    return 'Método de pago inválido';
  }
  return null;
}

/**
 * Valida que un número sea entero positivo.
 * @param numero - Número a validar.
 * @param campo - Nombre del campo (para mensajes).
 * @returns Mensaje de error o null si es válido.
 */
export function validarNumeroPositivo(numero: number, campo: string): string | null {
  if (!Number.isInteger(numero) || numero <= 0) {
    return `El campo ${campo} debe ser un número entero positivo`;
  }
  return null;
}

/**
 * Valida que el monto sea un número válido (puede ser string convertible a número positivo).
 * @param monto - Monto a validar (string o número).
 * @returns Mensaje de error o null si es válido.
 */
export function validarMonto(monto: string | number): string | null {
  const valor = typeof monto === 'string' ? parseFloat(monto) : monto;
  if (isNaN(valor) || valor <= 0) {
    return 'Monto inválido';
  }
  return null;
}

/**
 * Valida que la cantidad de paquetes coincida con la cantidad de piezas declarada.
 * @param cantPiezas - Cantidad declarada de piezas.
 * @param paquetes - Array con IDs o elementos de los paquetes.
 * @returns Mensaje de error o null si es válido.
 */
export function validarCantidadPaquetes(cantPiezas: number, paquetes: unknown[]): string | null {
  if (!Array.isArray(paquetes)) {
    return 'Paquetes debe ser un arreglo';
  }
  if (paquetes.length !== cantPiezas) {
    return `La cantidad de paquetes (${paquetes.length}) no coincide con la cantidad declarada (${cantPiezas})`;
  }
  return null;
}
