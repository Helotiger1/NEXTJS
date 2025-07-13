import { EditState } from "./components/EditState";



export const getColumns: any = (onChange: (id: string, nuevoEstado: string) => void) => [
  { key: "cod", label: "Codigo de envio" },
  { key: "origen", label: "Origen" },
  { key: "destino", label: "Destino" },
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
