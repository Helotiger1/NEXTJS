
"use client";

import { Field } from "../../(shared)/components/forms/types";
export const formConfig: Field[] = [
    {
        name: "tipoEnvio",
        label: "Tipo de Envio",
        type: "select",
        options: [
            { value: "Doral", label: "Barco" },
            { value: "Cliente", label: "Avion" },
        ],
    },
    {
        name: "almacenOrigen",
        label: "Lugar origen",
        type: "select",
        options: getAlmacenes
    },
    {
        name: "almacenEnvio",
        label: "Lugar destino",
        type: "select",
        options: getAlmacenes
    },
];



import { almacenService } from "@/app/services/almacenService";

type Option = {
    value: string | number;
    label: string;
};

export async function getAlmacenes() {
    const data = await almacenService.obtenerTodos();
    return toOptions(data);
}

export function toOptions(data: any[]): Option[] {
    return data.map((item) => ({
        value: item.codigo, // o cualquier identificador único
        label: `${item.estado} - ${item.ciudad}`,
    }));
}

export const getColumns: any = (handleCheck: (row: any, checked: boolean) => void, array: any, id :any ) => [
  {key: "cedulaDueña", label: "Cedula dueña"},
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
        key: "seleccionado",
        label: "Seleccionar",
        render: (_: any, row: any) => (
            <input
            checked={array.some((item:any) => item[id] === row[id])}
                type="checkbox"
                onChange={(e) => handleCheck(row, e.target.checked)}
            />
        ),
    },
];


import React from "react";

type Column<T> = {
  key: keyof T | "acciones" | "seleccionado" | "tipo";
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type Package = {
  tracking: string;
  descripcion: string;
  origen: string;
  destino: string;
  peso: string;
  alto: string;
  fecha: string;
  cedula: string;
  tipo: string
};

const handleVerDetalles = (tracking: string) => {
  alert(`Detalles de (Aquí irá detalles factura) ${tracking}`);
};


export const data: Package[] = [
  {
    tracking: "001",
    descripcion: "Ropa de invierno",
    origen: "New York",
    destino: "Caracas",
    peso: "2.5 kg",
    alto: "30 cm",
    fecha: "2025-07-01",
    cedula: "12345678",
    tipo : "barco"
  },
  {
    tracking: "002",
    descripcion: "Electrónica",
    origen: "Miami",
    destino: "Bogotá",
    peso: "1.2 kg",
    alto: "15 cm",
    fecha: "2025-07-03",
    cedula: "87654321",
    tipo : "barco"
  },
  {
    tracking: "003",
    descripcion: "Libros",
    origen: "Madrid",
    destino: "Buenos Aires",
    peso: "3.0 kg",
    alto: "25 cm",
    fecha: "2025-07-02",
    cedula: "11223344",
    tipo : "barco"
  },
];
export const columns: Column<Package>[] = [
  { key: "descripcion", label: "Descripción" },
  { key: "origen", label: "Origen" },
  { key: "destino", label: "Destino" },
  { key: "peso", label: "Peso" },
  { key: "alto", label: "Alto" },
  { key: "fecha", label: "Fecha" },
  { key: "tipo", label: "Tipo" },
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
];
