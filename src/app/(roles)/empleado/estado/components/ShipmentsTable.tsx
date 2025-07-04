"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { EditState } from "./EditState";

export const ShipmentsTable = () => {
    const data :any = [{
  cod: "001",
  origen: "Doral",
  destino: "Maracaibo",
  f_sal: "2025-07-01",
  tipo: "Avion",
  estado: "En transito"
},{
  cod: "002",
  origen: "Doral",
  destino: "Maracaibo",
  f_sal: "2025-07-01",
  tipo: "Barco",
  estado: "Recibido"
},
]
    const columns = [
        { key: "cod", label: "Codigo de envio" },
        { key: "origen", label: "Origen" },
        { key: "destino", label: "Destino" },
        { key: "f_sal", label: "Fecha Salida" },
        { key: "tipo", label: "Tipo" },
  {
    key: "acciones",
    label: "Estado",
    render: (_ :any , row:any) => (
      <EditState initial={row.estado} onChange={()=>{}}></EditState>
    )
  }

    ];
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
