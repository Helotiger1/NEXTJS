"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { getColumns } from "../configs";
import { useServiceId } from "../../facturas/components/useServiceId";

export const EnviosCliente = ({id} : { id?: string}) => {
    const url = "/envios/cliente?clienteId="
    const { data, loading, error, updater } = useServiceId(url, id);

    const columns = getColumns();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    console.log(data[0]);
    return <DynamicTable idName="tracking" name="Historial de Envíos" data={data} columns={columns} rowsPerPage={8}></DynamicTable>

};
