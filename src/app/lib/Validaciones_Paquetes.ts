// src/app/lib/Validaciones_Paquetes.ts

/**
 * Tipos y constantes para estados y eventos
 */
export const estadosPaquetePermitidos = [
  "REGISTRADO",
  "EN_TRANSITO",
  "EN_ALMACEN",
  "ENTREGADO",
  "CANCELADO",
] as const;

export const eventosEstadoPermitidos = [
  "registrar", // REGISTRADO
  "embarcar", // REGISTRADO → EN_TRANSITO
  "llegar", // EN_TRANSITO → EN_ALMACEN
  "entregar", // EN_ALMACEN → ENTREGADO
  "cancelar", // * → CANCELADO
] as const;

export type EstadoPaquete = (typeof estadosPaquetePermitidos)[number];
export type EventoEstado = (typeof eventosEstadoPermitidos)[number];

// Mapeo de eventos a estados resultantes
const eventoAEstado: Record<EventoEstado, EstadoPaquete> = {
  registrar: "REGISTRADO",
  embarcar: "EN_TRANSITO",
  llegar: "EN_ALMACEN",
  entregar: "ENTREGADO",
  cancelar: "CANCELADO",
};

// Transiciones de estado permitidas
const transicionesPermitidas: Record<EstadoPaquete, EstadoPaquete[]> = {
  REGISTRADO: ["EN_TRANSITO", "CANCELADO"],
  EN_TRANSITO: ["EN_ALMACEN", "CANCELADO"],
  EN_ALMACEN: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

/**
 * Valida las medidas físicas del paquete con más detalle
 */
export function validarMedidas(medidas: {
  largo?: unknown;
  ancho?: unknown;
  alto?: unknown;
  peso?: unknown;
}): string | null {
  const { largo, ancho, alto, peso } = medidas;
  const validaciones = [
    { campo: "largo", valor: largo, max: 120 }, // 120 pulgadas (10 pies)
    { campo: "ancho", valor: ancho, max: 120 },
    { campo: "alto", valor: alto, max: 120 },
    { campo: "peso", valor: peso, max: 150 }, // 150 lbs
  ];

  for (const { campo, valor, max } of validaciones) {
    // Validar existencia
    if (valor === undefined || valor === null) {
      return `El campo '${campo}' es obligatorio`;
    }

    // Validar tipo numérico
    if (typeof valor !== "number" || isNaN(valor)) {
      return `El campo '${campo}' debe ser un número válido`;
    }

    // Validar rango positivo
    if (valor <= 0) {
      return `El campo '${campo}' debe ser mayor a cero`;
    }

    // Validar máximo
    if (valor > max) {
      return `El campo '${campo}' no puede exceder ${max}`;
    }

    // Validar que dimensiones sean enteras
    if (campo !== "peso" && !Number.isInteger(valor)) {
      return `El campo '${campo}' debe ser un número entero`;
    }
  }

  return null;
}

/**
 * Valida una transición de estado
 */
export function validarTransicionEstado(
  estadoActual: EstadoPaquete,
  nuevoEstado: EstadoPaquete
): string | null {
  if (estadoActual === nuevoEstado) {
    return `El paquete ya está en estado ${nuevoEstado}`;
  }

  if (!transicionesPermitidas[estadoActual].includes(nuevoEstado)) {
    return `No se puede cambiar de ${estadoActual} a ${nuevoEstado}`;
  }

  return null;
}

/**
 * Valida un evento de cambio de estado
 */
export function validarEventoEstado(
  estadoActual: EstadoPaquete,
  evento: string
): { error: string | null; nuevoEstado: EstadoPaquete | null } {
  if (!validarEventoEstadoString(evento)) {
    return {
      error: `Evento inválido. Valores permitidos: ${eventosEstadoPermitidos.join(
        ", "
      )}`,
      nuevoEstado: null,
    };
  }

  const nuevoEstado = eventoAEstado[evento];
  const error = validarTransicionEstado(estadoActual, nuevoEstado);

  return { error, nuevoEstado };
}

/**
 * Type guard para validar strings como EventoEstado
 */
export function validarEventoEstadoString(
  evento: string
): evento is EventoEstado {
  return eventosEstadoPermitidos.includes(evento.toLowerCase() as EventoEstado);
}

/**
 * Type guard para validar strings como EstadoPaquete
 */
export function validarEstadoPaqueteString(
  estado: string
): estado is EstadoPaquete {
  return estadosPaquetePermitidos.includes(estado as EstadoPaquete);
}

/**
 * Valida campos de dirección (para paquetes)
 */
export function validarDireccion(direccion: {
  linea1?: unknown;
  ciudad?: unknown;
  estado?: unknown;
  codigoPostal?: unknown;
}): string | null {
  const camposRequeridos = ["linea1", "ciudad", "estado", "codigoPostal"];

  for (const campo of camposRequeridos) {
    const valor = direccion[campo as keyof typeof direccion];

    if (typeof valor !== "string" || valor.trim() === "") {
      return `El campo '${campo}' es obligatorio`;
    }
  }

  // Validación específica para código postal
  if (typeof direccion.codigoPostal === "string") {
    const cp = parseInt(direccion.codigoPostal);
    if (isNaN(cp)) {
      return "El código postal debe ser numérico";
    }
  }

  return null;
}

/**
 * Valida que un valor sea un número positivo (mejorado)
 */
export function validarNumeroPositivo(
  valor: unknown,
  nombreCampo: string,
  options: { entero?: boolean } = {}
): string | null {
  // Debug más detallado
  console.log(`[validarNumeroPositivo] Campo: ${nombreCampo}`, {
    valor,
    tipo: typeof valor,
    esNull: valor === null,
    esUndefined: valor === undefined,
  });

  // Caso especial para valores null/undefined
  if (valor === null || valor === undefined) {
    return `${nombreCampo} es requerido`;
  }

  // Permitir tanto números como strings numéricos
  let num: number;
  if (typeof valor === "number") {
    num = valor;
  } else if (typeof valor === "string") {
    num = Number(valor);
    if (isNaN(num)) {
      return `${nombreCampo} debe ser un número válido`;
    }
  } else {
    return `${nombreCampo} debe ser un número`;
  }

  if (num <= 0) {
    return `${nombreCampo} debe ser positivo`;
  }

  if (options.entero && !Number.isInteger(num)) {
    return `${nombreCampo} debe ser un número entero`;
  }

  return null;
}

/**
 * Valida que un texto no esté vacío (mejorado)
 */
export function validarTextoNoVacio(
  valor: unknown,
  nombreCampo: string,
  options: { maxLength?: number; minLength?: number } = {}
): string | null {
  if (typeof valor !== "string") {
    return `${nombreCampo} debe ser texto`;
  }

  const trimmed = valor.trim();
  if (trimmed === "") {
    return `${nombreCampo} no puede estar vacío`;
  }

  if (options.minLength !== undefined && trimmed.length < options.minLength) {
    return `${nombreCampo} debe tener al menos ${options.minLength} caracteres`;
  }

  if (options.maxLength !== undefined && trimmed.length > options.maxLength) {
    return `${nombreCampo} no puede exceder ${options.maxLength} caracteres`;
  }

  return null;
}
