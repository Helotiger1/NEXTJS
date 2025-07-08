import { Field } from "@/app/(roles)/(shared)/components/forms/types";
export const registerUserFormConfig: Field[] = [
    {
        name: "nombre",
        label: "Nombre",
        type: "text",
    },
    {
        name: "apellido",
        label: "Apellido",
        type: "text",
    },
    {
        name: "cedula",
        label: "Cedula",
        type: "text",
    },
    {
        name: "telefono",
        label: "Telefono",
        type: "text",
    },
    {
        name: "email",
        label: "Correo",
        type: "email",
    },
    {
        name: "contraseña",
        label: "Contraseña",
        type: "text",
    },
    {
        name: "rol",
        label: "Rol",
        type: "select",
        options: [
            { value: "ADMIN", label: "Administrador" },
            { value: "CLIENTE", label: "Cliente" },
            { value: "EMPLEADO", label: "Empleado" },
        ],
    },
];
