import { EstadoBadge } from "@/app/(roles)/(shared)/EstadoBadge";

    export const data = [
  {
    name: "FAC-0001",
    fechaEmision: "2025-06-15",
    montoTotal: "$150.00",
    estado: "PENDIENTE",
  },
  {
    name: "FAC-0002",
    fechaEmision: "2025-06-20",
    montoTotal: "$230.50",
    estado: "PAGADA",
  },
  {
    name: "FAC-0003",
    fechaEmision: "2025-06-25",
    montoTotal: "$89.99",
    estado: "Pendiente",
  },
];


export const columns = [
  { key: "name", label: "N° de Factura" },
  { key: "fechaEmision", label: "Fecha de emisión" },
  { key: "montoTotal", label: "Monto total" },
  {
    key: 'estado',
    label: 'Estado',
    render: EstadoBadge
  },
  {
  key: "acciones_pago",
  label: "Pagar",
  render: (_: any, row: any) => (
    <button
      disabled={row.estado === 'PAGADA'}
      onClick={() => alert(`Proceder al pago de ${row.name}`)}
      className={`text-blue-600 underline px-2 py-1 rounded 
        ${row.estado === 'PAGADA' ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-800'}
      `}
    >
      Pagar deuda
    </button>
  ),
},
  {
    key: "acciones_pdf",
    label: "PDF",
    render: (_: any, row: any) => (
      <button
        onClick={() => alert(`(Mock) Descargar PDF de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Descargar PDF
      </button>
    ),
  },
    {
    key: "acciones",
    label: "Acciones",
    render: (_: any, row: any) => (
      <button
        onClick={() => alert(`Detalles de (Aqui ira detalles) ${row.name}`)}
        className="text-blue-600 underline"
      >
        Ver detalles
      </button>
    ),
  },
];