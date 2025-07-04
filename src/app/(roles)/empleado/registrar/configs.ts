import { Field } from "@/app/(roles)/(shared)/components/forms/types";
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