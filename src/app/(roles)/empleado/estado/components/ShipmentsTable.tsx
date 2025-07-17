"use client";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { useCRUDForm } from "@/app/(roles)/(shared)/hooks/useCRUDForm";
import { getColumns } from "../configs";
import { envioEstadoService } from "@/app/services/enviosEstadoService";

export const ShipmentsTable = () => {
    const id = "numero";
    const { data, loading, error, updater } = useCRUDForm(envioEstadoService);

    const onChange = async (row: any, nuevoEstado: string) => {
        const confirmar = window.confirm(
            `¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`
        );
        if (!confirmar) return;

        try {
            row.estado = nuevoEstado;
            console.log(row);
            await envioEstadoService.actualizar(row[id], row);
            alert("Estado actualizado correctamente.");
            updater();
        } catch (err) {
            alert("Hubo un error al actualizar el estado.");
            console.error(err);
            updater();
        }
    };

    const columns = getColumns(onChange);


    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    console.log(data);
    return <DynamicTable name="Actualizar estado." data={data} columns={columns} rowsPerPage={8} />;
};
