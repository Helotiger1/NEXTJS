import { Field } from "../../(shared)/components/forms/types";
import { getAlmacenes } from "../facturas/configs";
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
