"use client"
import { Field } from "@/app/(roles)/(shared)/components/forms/types";



export const initState = {
  "direccion.linea1" : "",
  "direccion.linea2": "",
  "direccion.pais": "",
  "direccion.estado": "",
  "direccion.ciudad": "",
  "direccion.codigoPostal": "",
  "telefono": "",
};

export const formConfig: Field[] = [
    {
        name: "direccion.pais",
        label: "Pais",
        type: "text",
    },
    {
        name: "direccion.estado",
        label: "Estado",
        type: "text",
    },
    {
        name: "direccion.ciudad",
        label: "Ciudad",
        type: "text",
    },
    {
        name: "direccion.codigoPostal",
        label: "Codigo Postal",
        type: "text",
    },
    {
        name: "direccion.linea1",
        label: "Linea 1",
        type: "text",
    },
    {
        name: "direccion.linea2",
        label: "Linea 2",
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
    { key: "direccion.linea1", label: "Dirección Línea 1" },
    { key: "direccion.linea2", label: "Dirección Línea 2" },
    { key: "direccion.pais", label: "País" },
    { key: "direccion.estado", label: "Estado" },
    { key: "direccion.ciudad", label: "Ciudad" },
    { key: "direccion.codigoPostal", label: "Código Postal" },
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