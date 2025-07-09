import { Field } from "@/app/(roles)/(shared)/components/forms/types";
import { Almacen, almacenService } from "@/app/services/almacenService";
import DynamicForm from "../../(shared)/components/forms/DynamicForm";

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

export const getColumns = (
    updater: () => void,
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
                onClick={() => {handleEdit(row)}}
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
                onClick={async () => {
                    await almacenService.eliminar(row.codigo);
                    updater();
                }}
                className="text-blue-600 underline">
                Eliminar
            </button>
        ),
    },
];

export const data = [
    {
        codigo: "A001",
        telefono: "0414-1234567",
        linea1: "Av. Principal, Edif. Central",
        linea2: "Piso 2, Oficina 4B",
        pais: "Venezuela",
        estado: "Distrito Capital",
        ciudad: "Caracas",
        codigoPostal: "1010",
    },
    {
        codigo: "A002",
        telefono: "0426-7654321",
        linea1: "Calle 8, Residencias Sol",
        linea2: "Apto 12-C",
        pais: "Venezuela",
        estado: "Zulia",
        ciudad: "Maracaibo",
        codigoPostal: "4001",
    },
    {
        codigo: "A003",
        telefono: "0412-9876543",
        linea1: "Carrera 5, Quinta Las Palmas",
        linea2: "Sector La Floresta",
        pais: "Venezuela",
        estado: "Carabobo",
        ciudad: "Valencia",
        codigoPostal: "2001",
    },
];
