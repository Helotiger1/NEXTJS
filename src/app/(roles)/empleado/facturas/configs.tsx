"use client";
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

export const getColumns: any = (handleCheck: (row: any) => void) => [
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
                type="checkbox"
                onChange={() => handleCheck(row)}
            />
        ),
    },
];
