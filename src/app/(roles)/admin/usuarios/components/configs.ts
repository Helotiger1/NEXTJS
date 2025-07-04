import { Field } from "@/app/(roles)/(shared)/components/forms/types";
export const registerUserFormConfig: Field[] = [
    {
        name: "1",
        label: "Nombre",
        type: "text",
    },
    {
        name: "2",
        label: "Telefono",
        type: "text",
    },
    {
        name: "3",
        label: "Correo",
        type: "email",
    },
    {
        name: "4",
        label: "Contraseña",
        type: "text",
    },
    {
        name: "5",
        label: "Confirmar contraseña",
        type: "text",
    },
    {
        name: "6",
        label: "Rol",
        type: "select",
        options: [
            { value: "Administrador", label: "Administrador" },
            { value: "Cliente", label: "Cliente" },
            { value: "Empleado", label: "Empleado" },
        ],
    },
];
