"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";

export const PackageTable = () => {
    const data :any = []
    const columns = [
        { key: "name", label: "Tracking" },
        { key: "email", label: "Descripcion" },
        { key: "email", label: "Origen" },
        { key: "email", label: "Destino" },
        { key: "email", label: "Estado" },
        { key: "email", label: "Peso" },
        { key: "email", label: "Alto" },
        { key: "email", label: "Fecha" },
        { key: "email", label: "Oficina" },
         {
    key: "acciones",
    label: "Acciones",
    render: (_ :any , row:any) => (
      <button
        onClick={() => alert(`Detalles de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Ver detalles
      </button>
    )
  }

    ];
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
