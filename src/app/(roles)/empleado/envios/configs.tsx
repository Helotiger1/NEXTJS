
"use client";

import { Field } from "../../(shared)/components/forms/types";
export const formConfig: Field[] = [
    {
        name: "tipo",
        label: "Tipo de Envio",
        type: "select",
        options: [
            { value: "BARCO", label: "Barco" },
            { value: "AVION", label: "Avion" },
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
import { clienteService } from "@/app/services/clienteService";

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
        value: item.codigo,
        label: `${item["direccion.pais"]} - ${item["direccion.estado"]} ID ${item["direccion.id"]}`,
    }));
}


export async function getClientes() {
    const data = await clienteService.obtenerTodos();
    return toOptionsClientes(data);
}

export function toOptionsClientes(data: any[]): Option[] {
    return data.map((item) => ({
        value: item.id, 
        label: `${item["cedula"]} - ${item["nombre"]} ${item["apellido"]}`,
    }));
}




export const getColumns: any = (handleCheck: (row: any, checked: boolean) => void, array: any, id :any ) => [
    { key: "tracking", label: "Tracking" },
    { key: "tipoEnvio", label: "Tipo" },
    { key: "descripcion", label: "Descripción" },
    { key: "origen.direccion.estado", label: "Origen" },
    { key: "destino.direccion.estado", label: "Destino" },
    { key: "medidas.peso", label: "Peso" },
    { key: "medidas.alto", label: "Alto" },
    { key: "medidas.largo", label: "Largo" },
    { key: "medidas.volumen", label: "Volumen" },
    {
        key: "seleccionado",
        label: "Seleccionar",
        render: (_: any, row: any) => (
  <input
    checked={Array.isArray(array) && array.some((item: any) => item[id] === row[id])}
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
