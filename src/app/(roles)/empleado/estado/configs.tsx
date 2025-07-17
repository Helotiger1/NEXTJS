import { EditState } from "./components/EditState";



export const getColumns: any = (onChange: (id: string, nuevoEstado: string) => void) => [
  { key: "numero", label: "Codigo de envio" },
  { key: "Origen.direccion.estado", label: "Origen" },
  { key: "Envio.direccion.estado", label: "Destino" },
  { key: "fechaSalida", label: "Fecha Salida" },
  { key: "tipo", label: "Tipo" },
  {
    key: "acciones",
    label: "Estado",
    render: (_: any, row: any) => (
      <EditState
        initial={row.estado}
        onChange={(nuevoValor: string) => onChange(row, nuevoValor)}
      />
    ),
  },
];
