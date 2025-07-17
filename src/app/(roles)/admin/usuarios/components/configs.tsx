"use client"
import { Field } from "@/app/(roles)/(shared)/components/forms/types";
import { Usuario } from "@/app/services/usuarioService";
export const formConfig: Field[] = [
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
        name: "contrasena",
        label: "Contraseña",
        type: "password",
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


export const initState: Usuario= {
  nombre: "",
  apellido: "",
  cedula: "",
  telefono: "",
  email: "",
  contrasena: "",
  rol: "ADMIN" 
}


export const getColumns = (
  handleDelete: (id: string) => void,
  handleEdit: (row: any) => void
) => [
  { key: "cedula", label: "Cédula" },
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Correo" },
  {key: "rol", label: "Rol"},
  {
    key: "editar",
    label: "Editar",
    render: (_: any, row: any) => (
      <button onClick={() => handleEdit(row)} className="text-blue-600 underline">
        Editar
      </button>
    ),
  },
  {
    key: "eliminar",
    label: "Eliminar",
    render: (_: any, row: any) => (
      <button onClick={() => handleDelete(row.id)} className="text-blue-600 underline">
        Eliminar
      </button>
    ),
  },
];
