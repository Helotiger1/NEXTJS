import { Field } from "../../../(shared)/components/forms/types";

type Package = {
  tracking: string;
  descripcion: string;
  origen: string;
  destino: string;
  peso: string;
  alto: string;
  fecha: string;
  cedula: string;
};

export const initState = {
  cedulaOrigen: "",
  cedulaDestino: "",
  largo: "",
  ancho: "",
  alto: "",
  peso: "",
  pieCubico: "",
  tipoEnvio: "",
  origen: "",
  destino: "",
};


export const getColumns = (
  handleDelete: (id: string) => void,
  handleEdit: (row: any) => void
) => [
  { key: "cedula", label: "Cedula dueña" },
  { key: "tracking", label: "Tracking" },
  { key: "descripcion", label: "Descripción" },
  { key: "origen", label: "Origen" },
  { key: "destino", label: "Destino" },
  { key: "peso", label: "Peso" },
  { key: "alto", label: "Alto" },
  { key: "fecha", label: "Fecha" },
  {
    key: "seleccionado",
    label: "Seleccionar",
    render: (_: any, row: any) => (
      <input
        type="checkbox"
        checked={row.seleccionado}
        onChange={(e) => {
          console.log(
            `Fila ${row.cod} seleccionada: ${e.target.checked}`
          );
        }}
      />
    ),
  },
  {
    key: "Editar",
    label: "Editar",
    render: (_: any, row: any) => (
      <button
        onClick={() => handleEdit(row)}
        className="text-blue-600 underline"
      >
        Editar
      </button>
    ),
  },
  {
    key: "Eliminar",
    label: "Eliminar",
    render: (_: any, row: any) => (
      <button
        onClick={() => handleDelete(row.id)}
        className="text-blue-600 underline"
      >
        Eliminar
      </button>
    ),
  },
];



export const formConfig: Field[] = [
  {
    name: "cedulaOrigen",
    label: "Cedula del cliente origen",
    type: "text",
  },
  {
    name: "cedulaDestino",
    label: "Cedula Destinatario",
    type: "text",
  },
  {
    name: "largo",
    label: "Largo",
    type: "text",
  },
  {
    name: "ancho",
    label: "Ancho",
    type: "text",
  },
  {
    name: "alto",
    label: "Alto",
    type: "text",
  },
  {
    name: "peso",
    label: "Peso en Libras",
    type: "text",
  },
  {
    name: "pieCubico",
    label: "Pie cubicos",
    type: "text",
  },
  {
    name: "tipoEnvio",
    label: "Tipo de Envio",
    type: "select",
    options: [
      { value: "Barco", label: "Barco" },
      { value: "Avion", label: "Avion" },
    ],
  },
  {
    name: "origen",
    label: "Lugar origen",
    type: "select",
    options: [
      { value: "Doral", label: "Doral" },
      { value: "California", label: "California" },
      { value: "La Guaira", label: "La Guaira" },
      { value: "Nueva Esparta", label: "Nueva Esparta" },
    ],
  },
  {
    name: "destino",
    label: "Lugar destino",
    type: "select",
    options: [
      { value: "Doral", label: "Doral" },
      { value: "California", label: "California" },
      { value: "La Guaira", label: "La Guaira" },
      { value: "Nueva Esparta", label: "Nueva Esparta" },
    ],
  },
];
