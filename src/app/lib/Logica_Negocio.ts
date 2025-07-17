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
// - tipo: "AVION" | "BARCO"
// - pesoLb: libras
// - pieCubico: ft³ (volumen)
export function calcularPrecioEnvio(
  tipo: "AVION" | "BARCO",
  pesoLb: number,
  pieCubico: number
): number {
  if (tipo === "BARCO") {
    const monto = pieCubico * 25;
    return monto < 35 ? 35 : parseFloat(monto.toFixed(2));
  }
  // tipo === "AVION"
  const monto = Math.max(pesoLb * 7, pieCubico * 7);
  return monto < 45 ? 45 : parseFloat(monto.toFixed(2));
}

// 3) Generar factura a partir de un arreglo de paquetes
export interface PaqueteParaFactura {
  tracking: number;
  pesoLb: number;
  pieCubico: number;
  tipoEnvio: "AVION" | "BARCO";
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

// 4) Transiciones de estado del paquete
export type EstadoPaquete =
  | "REGISTRADO"
  | "EN_TRANSITO"
  | "EN_ALMACEN"
  | "ENTREGADO"
  | "CANCELADO";

// Mapa de transiciones permitidas por evento
const transiciones: Record<
  EstadoPaquete,
  Partial<Record<string, EstadoPaquete>>
> = {
  REGISTRADO: { embarcar: "EN_TRANSITO" },
  EN_TRANSITO: { llegar: "EN_ALMACEN" },
  EN_ALMACEN: { entregar: "ENTREGADO" },
  ENTREGADO: {},
  CANCELADO: {},
};

// Función para obtener el siguiente estado según el evento
export function siguienteEstado(
  actual: EstadoPaquete,
  evento: "registrar" | "embarcar" | "llegar" | "entregar"
): EstadoPaquete {
  if (evento === "registrar") return "REGISTRADO";
  const siguiente = transiciones[actual]?.[evento];
  if (!siguiente)
    throw new Error(
      `No se puede aplicar el evento '${evento}' desde '${actual}'`
    );
  return siguiente;
}

// 5) Función para calcular costo de envío a partir de un objeto paquete
export function calcularCostoEnvio(
  paquete: { medidas: { volumen: number; peso: number } },
  tipo: "AVION" | "BARCO"
): number {
  let monto: number;

  if (tipo === "BARCO") {
    monto = paquete.medidas.volumen * 25;
    monto = Math.max(monto, 35);
  } else {
    monto = Math.max(
      paquete.medidas.peso * 7,
      paquete.medidas.volumen * 7
    );
    monto = Math.max(monto, 45);
  }

  return parseFloat(monto.toFixed(2));
}
