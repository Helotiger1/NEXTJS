"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";

export const BillsTable = () => {
    const data :any = []
    const columns = [
        { key: "name", label: "N° de Factura" },
        { key: "email", label: "Fecha de emision" },
        { key: "email", label: "Monto total" },
        { key: "email", label: "Estado" },
        { key: "email", label: "Estado" },
         {
    key: "acciones",
    label: "Pagar",
    render: (_ :any , row:any) => (
      <button
        onClick={() => alert(`Proceder al pago de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Pagar deuda
      </button>
    )
  },
  {
    key: "acciones",
    label: "PDF",
    render: (_ :any , row:any) => (
      <button
        onClick={() => alert(`Proceder al pago de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Descargar PDF
      </button>
    )
  }

    ];
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
