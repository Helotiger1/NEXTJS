export const columns = [
  { key: "tracking", label: "Codigo de Tracking" },
  { key: "codigoEnvio", label: "Codigo de envio" },
  { key: "origen", label: "Origen" },
  { key: "destino", label: "Destino" },
  { key: "fechaSalida", label: "Fecha Salida" },
  { key: "tipo", label: "Tipo" },
  { key: "estado", label: "Estado" },
];

export const data = [
  {
    tracking: "1001",
    codigoEnvio: "ENV-001",
    origen: "Guaira",
    destino: "Nueva esparta",
    fechaSalida: "2025-07-01",
    tipo: "Barco",
    estado: "En tránsito",
  },
  {
    tracking: "1002",
    codigoEnvio: "ENV-002",
    origen: "pipe",
    destino: "culo",
    fechaSalida: "2025-07-03",
    tipo: "Avion",
    estado: "Pendiente",
  },
  {
    tracking: "1003",
    codigoEnvio: "ENV-003",
    origen: "Doral",
    destino: "Nueva Esparta",
    fechaSalida: "2025-07-02",
    tipo: "Barco",
    estado: "Entregado",
  },
];
