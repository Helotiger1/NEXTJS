"use client";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";

export const ClientesTable = () => {
  const data = [
    {
      cedula: "12345678",
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan.perez@example.com",
      telefono: "+58 123 456 7890",
    },
    {
      cedula: "87654321",
      nombre: "María",
      apellido: "Gómez",
      email: "maria.gomez@example.com",
      telefono: "+58 098 765 4321",
    },
    {
      cedula: "11223344",
      nombre: "Carlos",
      apellido: "Ramírez",
      email: "carlos.ramirez@example.com",
      telefono: "+58 555 444 3333",
    },
  ];

  const columns = [
    { key: "cedula", label: "Cedula" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Telefono" },
    {
      key: "ver_paquetes",
      label: "Ver paquetes",
      render: (_: any, row: any) => (
        <button
          onClick={() => alert(`Paquetes de ${row.nombre} ${row.apellido}`)}
          className="text-blue-600 underline"
        >
          Ver paquetes
        </button>
      ),
    },
    {
      key: "ver_facturas",
      label: "Ver facturas",
      render: (_: any, row: any) => (
        <button
          onClick={() => alert(`Facturas de ${row.nombre} ${row.apellido}`)}
          className="text-blue-600 underline"
        >
          Ver facturas
        </button>
      ),
    },
  ];

  return <DynamicTable data={data} columns={columns} rowsPerPage={2} />;
};
