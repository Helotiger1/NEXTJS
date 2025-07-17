"use client";
import { Field } from "@/app/(roles)/(shared)/components/forms/types";
import { paquetePayload } from "@/app/services/paqueteService";
import { getAlmacenes, getClientes } from "../envios/configs";

export const initState = {
    "cedulaDestino.direccion.estado": "",
    "cedulaOrigen.direccion.estado": "",
    descripcion: "",
    fecha: "",
    cedula: "",
    "medidas.largo": "",
    ancho: "",
    "medidas.alto": "",
    "medidas.peso": "",
    tipoEnvio: "",
    "almacenOrigen.direccion.estado": "",
    "almacenDestino.direccion.estado": "",
};

export const formConfig: Field[] = [
    {
        name: "clienteOrigenId",
        label: "Cliente origen",
        type: "select",
        placeholder: "Seleccione cliente origen",
        options: async () => [
            { value: "", label: "Seleccione cliente origen", disabled: true },
            ...(await getClientes())
        ],
        required: true
    },
    {
        name: "clienteDestinoId",
        label: "Cliente destino",
        type: "select",
        placeholder: "Seleccione cliente destino",
        options: async () => [
            { value: "", label: "Seleccione cliente destino", disabled: true },
            ...(await getClientes())
        ],
        required: true
    },
    {
        name: "descripcion",
        label: "Descripción",
        type: "text",
        placeholder: "Ingrese descripción del paquete",
        required: true
    },
    {
        name: "medidas.largo",
        label: "Largo (in)",
        type: "number",
        placeholder: "Ej: 30",
        required: true
    },
    {
        name: "medidas.ancho",
        label: "Ancho (in)",
        type: "number",
        placeholder: "Ej: 20",
        required: true
    },
    {
        name: "medidas.alto",
        label: "Alto (in)",
        type: "number",
        placeholder: "Ej: 15",
        required: true
    },
    {
        name: "medidas.peso",
        label: "Peso (Lb)",
        type: "number",
        placeholder: "Ej: 2.5",
        required: true
    },
    {
        name: "tipoEnvio",
        label: "Tipo de Envío",
        type: "select",
        placeholder: "Seleccione tipo de envío",
        options: [
            { value: "", label: "Seleccione tipo de envío", disabled: true },
            { value: "BARCO", label: "Barco" },
            { value: "AVION", label: "Avión" }
        ],
        required: true
    },
    {
        name: "origenId",
        label: "Almacén origen",
        type: "select",
        placeholder: "Seleccione almacén origen",
        options: async () => [
            { value: "", label: "Seleccione almacén origen", disabled: true },
            ...(await getAlmacenes())
        ],
        required: true
    },
    {
        name: "destinoId",
        label: "Almacén destino",
        type: "select",
        placeholder: "Seleccione almacén destino",
        options: async () => [
            { value: "", label: "Seleccione almacén destino", disabled: true },
            ...(await getAlmacenes())
        ],
        required: true
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
    { key: "medidas.peso", label: "Peso (Lb)" },
    { key: "medidas.alto", label: "Alto (in)" },
    { key: "medidas.largo", label: "Largo (in)" },
    { key: "medidas.ancho", label: "Ancho (in)" },
    { key: "medidas.volumen", label: "Volumen (ft³)" },
    {
        key: "Editar",
        label: "Editar",
        render: (_: any, row: any) => (
            <button
                onClick={() => handleEdit(row)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
            >
                ✎ Editar
            </button>
        ),
    },
    {
        key: "Eliminar",
        label: "Eliminar",
        render: (_: any, row: any) => (
            <button
                onClick={() => handleDelete(row.tracking)}
                className="text-red-600 hover:text-red-800 transition-colors"
            >
                ✕ Eliminar
            </button>
        ),
    },
];