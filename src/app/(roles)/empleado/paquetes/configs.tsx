"use client";
import { Field } from "@/app/(roles)/(shared)/components/forms/types";
import { paquetePayload } from "@/app/services/paqueteService";

export const initState: paquetePayload = {
    cedulaDestino: "",
    cedulaOrigen: "",
    descripcion: "",
    fecha: "",
    cedula: "",
    largo: "",
    ancho: "",
    alto: "",
    peso: "",
    tipoEnvio: "BARCO",
    origen: "",
    destino: "",
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
        name: "descripcion",
        label: "Descripcion",
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
    handleDelete: (id: string) => void,
    handleEdit: (row: any) => void
) => [
    { key: "tracking", label: "Tracking" },
    { key: "descripcion", label: "Descripción" },
    { key: "origen", label: "Origen" },
    { key: "destino", label: "Destino" },
    { key: "peso", label: "Peso" },
    { key: "alto", label: "Alto" },
    { key: "largo", label: "Largo" },
    { key: "volumen", label: "Volumen" },
    { key: "fecha", label: "Fecha" },
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
