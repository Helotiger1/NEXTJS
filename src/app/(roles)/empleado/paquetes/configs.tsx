"use client";
import { Field } from "@/app/(roles)/(shared)/components/forms/types";
import { paquetePayload } from "@/app/services/paqueteService";
import { getAlmacenes } from "../envios/configs";

export const initState = {
  "cedulaDestino.direccion.estado": "",
  "cedulaOrigen.direccion.estado": "",
  "descripcion": "",
  "fecha": "",
  "cedula": "",
  "medidas.largo": "",
  "ancho": "",
  "medidas.alto": "",
  "medidas.peso": "",
  "tipoEnvio": "BARCO",
  "almacenOrigen.direccion.estado": "",
  "almacenDestino.direccion.estado": ""
};


export const formConfig: Field[] = [
    {
        name: "cedulaOrigen.direccion.estado",
        label: "Cedula del cliente origen.direccion.estado",
        type: "text",
    },
    {
        name: "cedulaDestino.direccion.estado",
        label: "Cedula Destinatario",
        type: "text",
    },
    {
        name: "descripcion",
        label: "Descripcion",
        type: "text",
    },
    {
        name: "medidas.largo",
        label: "medidas.Largo",
        type: "text",
    },
    {
        name: "ancho",
        label: "Ancho",
        type: "text",
    },
    
    {
        name: "medidas.alto",
        label: "medidas.Alto",
        type: "text",
    },
    {
        name: "medidas.peso",
        label: "medidas.Peso en Libras",
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
        name: "origen.direccion.estado",
        label: "Lugar origen.direccion.estado",
        type: "select",
        options: getAlmacenes
    },
    {
        name: "destino.direccion.estado",
        label: "Lugar destino.direccion.estado",
        type: "select",
        options: getAlmacenes
    },
];

export const getColumns: any = (
    handleDelete: (id: string) => void,
    handleEdit: (row: any) => void
) => [
    { key: "tracking", label: "Tracking" },
    { key: "descripcion", label: "Descripción" },
    { key: "origen.direccion.estado", label: "Origen" },
    { key: "destino.direccion.estado", label: "Destino" },
    { key: "medidas.peso", label: "Peso" },
    { key: "medidas.alto", label: "Alto" },
    { key: "medidas.largo", label: "Largo" },
    { key: "medidas.volumen", label: "Volumen" },
    {
        key: "Editar",
        label: "Editar",
        render: (_: any, row: any) => (
            <button
                onClick={() => {
                    handleEdit(row);
                }}
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
                onClick={() => handleDelete(row.tracking)}
                className="text-blue-600 underline">
                Eliminar
            </button>
        ),
    },
];
