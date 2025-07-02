"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";

export const ShipmentsTable = () => {
    const data :any = []
    const columns = [
        { key: "name", label: "Codigo de envio" },
        { key: "email", label: "Origen" },
        { key: "email", label: "Destino" },
        { key: "email", label: "Fecha Salida" },
        { key: "email", label: "Fecha Llegada" },
        { key: "email", label: "Tipo" },
        { key: "email", label: "Estado" },
  {
    key: "acciones",
    label: "Accion",
    render: (_ :any , row:any) => (
      <button
        onClick={() => alert(`no se datos de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Ver detalles
      </button>
    )
  }

    ];
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
