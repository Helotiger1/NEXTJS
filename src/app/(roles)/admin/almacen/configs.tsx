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
        name: "linea1",
        label: "Linea 1",
        type: "text",
    },
    {
        name: "linea2",
        label: "Linea 2",
        type: "text",
    },
    {
        name: "pais",
        label: "Pais",
        type: "text",
    },
    {
        name: "estado",
        label: "Estado",
        type: "text",
    },
    {
        name: "ciudad",
        label: "Ciudad",
        type: "text",
    },
    {
        name: "codigoPostal",
        label: "Codigo Postal",
        type: "text",
    },
    {
        name: "telefono",
        label: "Telefono",
        type: "text",
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
        label: "Ver paquetes",
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
        label: "Ver paquetes",
        render: (_: any, row: any) => (
            <button
                onClick={() => handleDelete(row.id)}
                className="text-blue-600 underline">
                Eliminar
            </button>
        ),
    },
];