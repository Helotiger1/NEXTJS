"use client"
import { Field } from "@/app/(roles)/(shared)/components/forms/types";



export const initState = {
  linea1: "",
  linea2: "",
  pais: "",
  estado: "",
  ciudad: "",
  codigoPostal: "",
  telefono: "",
};

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


export const getColumns: any = (
    handleDelete: (id : string) => void,
    handleEdit: (row : any) => void
) => [
    { key: "codigo", label: "Código" },
    { key: "telefono", label: "Teléfono" },
    { key: "linea1", label: "Dirección Línea 1" },
    { key: "linea2", label: "Dirección Línea 2" },
    { key: "pais", label: "País" },
    { key: "estado", label: "Estado" },
    { key: "ciudad", label: "Ciudad" },
    { key: "codigoPostal", label: "Código Postal" },
    {
        key: "Editar",
        label: "Editar",
        render: (_: any, row: any) => (
            <button
                onClick={()=> { handleEdit(row)}}
                className="text-blue-600 underline">
                Editar
            </button>
        ),
    },
    {
        key: "Eliminar",
        label: "Eliminar",
        render: (_: any, row: any) => (
            <button
                onClick={() => handleDelete(row.codigo)}
                className="text-blue-600 underline">
                Eliminar
            </button>
        ),
    },
];