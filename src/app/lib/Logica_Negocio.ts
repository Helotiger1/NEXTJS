// src/lib/negocio.ts

// 1) Calcular pie cúbico (ft³) a partir de largo × ancho × alto (pulgadas)
export function calcularPieCubico(
  largoIn: number,
  anchoIn: number,
  altoIn: number
): number {
  const volumenIn3 = largoIn * anchoIn * altoIn;
  // 1 ft³ = 1 728 in³
  return parseFloat((volumenIn3 / 1728).toFixed(2));
}

// 2) Calcular el precio de envío para un paquete
// - tipo: "avion" | "barco"
// - pesoLb: libras
// - pieCubico: ft³ (volumen)
export function calcularPrecioEnvio(
  tipo: "avion" | "barco",
  pesoLb: number,
  pieCubico: number
): number {
  if (tipo === "barco") {
    // $25 por pie cúbico - mínimo $35
    const monto = pieCubico * 25;
    return monto < 35 ? 35 : parseFloat(monto.toFixed(2));
  }
  // tipo === "avion"
  // $7 por libra o por pie cúbico (el mayor) - mínimo $45
  const monto = Math.max(pesoLb * 7, pieCubico * 7);
  return monto < 45 ? 45 : parseFloat(monto.toFixed(2));
}

// 3) Generar factura a partir de un arreglo de paquetes
export interface PaqueteParaFactura {
  tracking: number;
  pesoLb: number;
  pieCubico: number;
  tipoEnvio: "avion" | "barco";
}
export interface ItemFactura {
  tracking: number;
  monto: number;
}
export function generarFactura(paquetes: PaqueteParaFactura[]): {
  total: number;
  items: ItemFactura[];
} {
  const items: ItemFactura[] = paquetes.map((p) => ({
    tracking: p.tracking,
    monto: calcularPrecioEnvio(p.tipoEnvio, p.pesoLb, p.pieCubico),
  }));
  const total = parseFloat(
    items.reduce((acc, it) => acc + it.monto, 0).toFixed(2)
  );
  return { total, items };
}

// 4) Cambiar estado de un paquete según evento simple
export type EstadoPaquete =
  | "recibido en almacén"
  | "en tránsito"
  | "disponible para despacho"
  | "despachado";

const transiciones: Record<EstadoPaquete, Partial<Record<string, EstadoPaquete>>> = {
  "recibido en almacén": { embarcar: "en tránsito" },
  "en tránsito": { llegar: "disponible para despacho" },
  "disponible para despacho": { entregar: "despachado" },
  "despachado": {},
};

export function siguienteEstado(
  actual: EstadoPaquete,
  evento: "registrar" | "embarcar" | "llegar" | "entregar"
): EstadoPaquete {
  if (evento === "registrar") return "recibido en almacén"; // permitido como primer estado

  const siguiente = transiciones[actual]?.[evento];
  if (!siguiente) throw new Error(`No se puede aplicar el evento '${evento}' desde '${actual}'`);
  return siguiente;
}


// Función para calcular costo de envío (debe coincidir con tus reglas de negocio)
export function calcularCostoEnvio(paquete: { medidas: { volumen: number; peso: number } }, tipo: 'barco' | 'avion'): number {
  let monto: number;
  
  if (tipo === 'barco') {
    monto = paquete.medidas.volumen * 25;
    monto = Math.max(monto, 35);
  } else {
    monto = Math.max(paquete.medidas.peso * 7, paquete.medidas.volumen * 7);
    monto = Math.max(monto, 45);
  }
  
  return parseFloat(monto.toFixed(2));
}