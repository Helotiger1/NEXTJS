// src/app/lib/Validaciones_Paquetes.ts

/**
 * Estados para eventos de cambio de estado (transiciones)
 */
export const eventosEstadoPermitidos = [
  "llegar",
  "embarcar",
  "registrar",
  "entregar",
] as const;

/**
 * Estados posibles de un paquete (deben coincidir con el enum en schema.prisma)
 */
export const estadosPaquetePermitidos = [
  "REGISTRADO",
  "EN_TRANSITO",
  "EN_ALMACEN",
  "ENTREGADO",
  "CANCELADO",
] as const;

export type EstadoPaquete = (typeof estadosPaquetePermitidos)[number];
export type EventoEstado = (typeof eventosEstadoPermitidos)[number];

/**
 * Valida las medidas físicas del paquete
 */
export function validarMedidas(medidas: {
  largo?: unknown;
  ancho?: unknown;
  alto?: unknown;
  peso?: unknown;
}): string | null {
  const camposRequeridos = ["largo", "ancho", "alto", "peso"];

  for (const campo of camposRequeridos) {
    const valor = medidas[campo as keyof typeof medidas];

    // Validar existencia
    if (valor === undefined || valor === null) {
      return `El campo '${campo}' es obligatorio`;
    }

    // Validar tipo numérico
    if (typeof valor !== "number" || isNaN(valor)) {
      return `El campo '${campo}' debe ser un número válido`;
    }

    // Validar valor positivo
    if (valor <= 0) {
      return `El campo '${campo}' debe ser positivo`;
    }

    // Validar que sea entero (excepto peso)
    if (campo !== "peso" && !Number.isInteger(valor)) {
      return `El campo '${campo}' debe ser un número entero`;
    }
  }

  return null;
}

/**
 * Calcula el volumen en pulgadas cúbicas
 */
export function calcularVolumen(
  largo: number,
  ancho: number,
  alto: number
): number {
  return Math.round(largo * ancho * alto); // Redondeado según requisitos
}

/**
 * Valida si un string es un EstadoPaquete válido
 */
export function validarEstadoPaquete(estado: string): estado is EstadoPaquete {
  return estadosPaquetePermitidos.includes(estado as EstadoPaquete);
}

/**
 * Valida si un string es un EventoEstado válido
 */
export function validarEventoEstado(evento: string): evento is EventoEstado {
  return eventosEstadoPermitidos.includes(evento.toLowerCase() as EventoEstado);
}

/**
 * Valida un estado genérico (para compatibilidad con código existente)
 * @deprecated Usar validarEstadoPaquete o validarEventoEstado según contexto
 */
export function validarEstado(estado: unknown): string | null {
  if (typeof estado !== "string" || estado.trim() === "") {
    return "El estado es obligatorio y debe ser texto.";
  }

  // Primero verifica si es un estado de paquete
  if (validarEstadoPaquete(estado)) {
    return null;
  }

  // Luego verifica si es un evento de estado
  if (validarEventoEstado(estado)) {
    return null;
  }

  return `Estado inválido. Valores permitidos: ${[
    ...estadosPaquetePermitidos,
    ...eventosEstadoPermitidos,
  ].join(", ")}`;
}

/**
 * Valida que un valor sea un número positivo
 */
export function validarNumeroPositivo(
  valor: unknown,
  nombreCampo: string
): string | null {
  if (typeof valor !== "number" || isNaN(valor)) {
    return `${nombreCampo} debe ser un número válido.`;
  }
  if (valor <= 0) {
    return `${nombreCampo} debe ser positivo.`;
  }
  return null;
}

/**
 * Valida que un texto no esté vacío
 */
export function validarTextoNoVacio(
  valor: unknown,
  nombreCampo: string
): string | null {
  if (typeof valor !== "string") {
    return `${nombreCampo} debe ser texto.`;
  }
  if (valor.trim() === "") {
    return `${nombreCampo} no puede estar vacío.`;
  }
  return null;
}
