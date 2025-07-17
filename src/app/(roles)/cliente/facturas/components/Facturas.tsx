"use client";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { data, columns } from "./configs";
import { useServiceId } from "./useServiceId";

export const Facturas = ({id}: {id?: string}) => {
    const service = "/facturas?clienteId="
    const { data, loading, error } = useServiceId(service, id);
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;

    return (
        <>
            <DynamicTable name="Facturas" 
                data={data}
                columns={columns}
                rowsPerPage={8}></DynamicTable>
        </>
    );
};
