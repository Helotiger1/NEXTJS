"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { getColumns } from "../configs";
import { paqueteService } from "@/app/services/paqueteService";
import { useCRUDForm } from "@/app/(roles)/(shared)/hooks/useCRUDForm";
import { useServiceId } from "../../facturas/components/useServiceId";

export const PaquetesCliente = ({id} : { id?: string}) => {
    const url = "/paquetes/"
    const { data, loading, error, updater } = useServiceId(url, id);

    const columns = getColumns();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    return <DynamicTable data={data} columns={columns} rowsPerPage={4}></DynamicTable>

};
