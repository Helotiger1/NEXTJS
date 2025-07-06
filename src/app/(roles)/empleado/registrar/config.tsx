import { Field } from "../../(shared)/components/forms/types";
export const formConfig: Field[] = [
    {
        name: "1",
        label: "Tipo de Envio",
        type: "select",
        options: [
            { value: "Doral", label: "Barco" },
            { value: "Cliente", label: "Avion" },
        ],
    },
    {
        name: "2",
        label: "Lugar origen",
        type: "select",
        options: [
            { value: "Doral", label: "Doral" },
            { value: "Cliente", label: "California" },
            { value: "Empleado", label: "La Guaira" },
            { value: "Doral", label: "Nueva Esparta" },
        ],
    },
    {
        name: "6",
        label: "Lugar destino",
        type: "select",
        options: [
            { value: "Doral", label: "Doral" },
            { value: "Cliente", label: "California" },
            { value: "Empleado", label: "La Guaira" },
            { value: "Doral", label: "Nueva Esparta" },
        ],
    },
];





import React from "react";

type Column<T> = {
  key: keyof T | "acciones" | "seleccionado";
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
  },
];
export const columns: Column<Package>[] = [
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
];


export const packageFormConfig: Field[] = [
    
        {
            name: "2",
            label: "Cedula del cliente origen",
            type: "text",
        },
        {
            name: "2",
            label: "Cedula Destinatario",
            type: "text",
        },
        {
            name: "2",
            label: "Largo",
            type: "text",
        },
        {
            name: "3",
            label: "Ancho",
            type: "text",
        },
        {
            name: "4",
            label: "Alto",
            type: "text",
        },
        {
            name: "5",
            label: "Peso en Libras",
            type: "text",
        },{
            name: "5",
            label: "Pie cubicos",
            type: "text",
        },
        {
            name: "6",
            label: "Tipo de Envio",
            type: "select",
            options: [
                { value: "Doral", label: "Barco" },
                { value: "Cliente", label: "Avion" },
            ],
        },
        {
            name: "6",
            label: "Lugar origen",
            type: "select",
            options: [
                { value: "Doral", label: "Doral" },
                { value: "Cliente", label: "California" },
                { value: "Empleado", label: "La Guaira" },
                { value: "Doral", label: "Nueva Esparta" },
            ],
        },
        {
            name: "6",
            label: "Lugar destino",
            type: "select",
            options: [
                { value: "Doral", label: "Doral" },
                { value: "Cliente", label: "California" },
                { value: "Empleado", label: "La Guaira" },
                { value: "Doral", label: "Nueva Esparta" },
            ],
        },
    ];