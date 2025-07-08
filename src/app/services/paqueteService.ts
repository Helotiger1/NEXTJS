export interface Paquete {
  tracking: number;
  descripcion: string;
  estado: "EN_CAMINO" | "ENTREGADO" | "PENDIENTE"; // ajustalo a tus valores reales de EstadoPaquete
  almacenCodigo: number;
  medidasId: number;
  origenId: number;
  destinoId: number;
}
