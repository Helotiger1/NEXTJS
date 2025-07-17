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
  { key: "numero", label: "N° de Factura" },               // número factura
  { key: "envioNum.fechaSalida", label: "Fecha de emisión", render: (value: string) => new Date(value).toLocaleDateString() },
  { key: "monto", label: "Monto total", render: (value: number) => `$ ${value.toFixed(2)}` },
  { key: "cantPiezas", label: "Cantidad de piezas" },
  {
    key: "estado",
    label: "Estado",
    render: EstadoBadge,
  },
  { key: "cliente.nombre", label: "Cliente" },
  { key: "cliente.email", label: "Email" },
  { key: "cliente.telefono", label: "Teléfono" },

  {
    key: "acciones_pago",
    label: "Pagar",
    render: (_: any, row: any) => (
      <button
        disabled={row.estado === "PAGADA"}
        onClick={() => alert(`Proceder al pago de factura #${row.numero}`)}
        className={`text-blue-600 underline px-2 py-1 rounded ${
          row.estado === "PAGADA"
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-blue-800"
        }`}
      >
        Pagar deuda
      </button>
    ),
  },
];


const detalleFacturaColumns = []