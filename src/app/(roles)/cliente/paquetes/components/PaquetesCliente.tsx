"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { getColumns } from "../configs";
import { useServiceId } from "../../facturas/components/useServiceId";
    const url = "/paquetes?clienteId="

export const PaquetesCliente = ({id} : { id?: string}) => {

    const { data, loading, error, updater } = useServiceId(url, id);
    console.log(data)

    const columns = getColumns();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;


    
    return <DynamicTable  idName="tracking" data={data} name="Historial de Paquetes"columns={columns} rowsPerPage={8}></DynamicTable>

};
