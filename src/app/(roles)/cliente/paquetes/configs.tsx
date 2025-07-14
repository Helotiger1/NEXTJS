export const data = [
  {
    name: "001",
    descripcion: "Ropa de invierno",
    origen: "Doral",
    destino: "Nueva Esparta",
    estado: "En tránsito",
    peso: "2.5 lbs",
    alto: "30 cm",
    fecha: "2025-07-01",
  },
  {
    name: "002",
    descripcion: "Electrónica",
    origen: "Miami",
    destino: "Bogotá",
    estado: "Entregado",
    peso: "1.2 lbs",
    alto: "15 cm",
    fecha: "2025-07-03"
  },
  {
    name: "003",
    descripcion: "Libros",
    origen: "Madrid",
    destino: "Buenos Aires",
    estado: "Pendiente",
    peso: "3.0 lbs",
    alto: "25 cm",
    fecha: "2025-07-02" },
];


    export const getColumns: any = (
) => [
    { key: "tracking", label: "Tracking" },
    { key: "descripcion", label: "Descripción" },
    { key: "origen.direccion.estado", label: "Origen" },
    { key: "destino.direccion.estado", label: "Destino" },
    { key: "medidas.peso", label: "Peso" },
    { key: "medidas.alto", label: "Alto" },
    { key: "medidas.largo", label: "Largo" },
    { key: "medidas.volumen", label: "Volumen" },
];
