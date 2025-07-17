"use client";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { getColumns } from "../configs";
import { PaquetesCliente } from "@/app/(roles)/cliente/paquetes/components/PaquetesCliente";
import { useState } from "react";
import { GenericModal } from "./GenericModal";
import { Facturas } from "@/app/(roles)/cliente/facturas/components/Facturas";
import { useCRUDForm } from "@/app/(roles)/(shared)/hooks/useCRUDForm";
import { clienteService } from "@/app/services/clienteService";

export const ClientesTable = () => {

    
    const [modalInfo, setModalInfo] = useState({ tipo: null, id: null });

    const { data, loading, error } = useCRUDForm(clienteService);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;

    const columns = getColumns(setModalInfo);

    return (
        <div>
            <DynamicTable idName="cedula" name={'Clientes'} data={data} columns={columns} rowsPerPage={8} />
            {modalInfo.tipo === "paquetes" && modalInfo.id && (
                <GenericModal
                    onClose={() => setModalInfo({ tipo: null, id: null })}>
                    <PaquetesCliente id={modalInfo.id} />
                </GenericModal>
            )}
            
            {modalInfo.tipo === "facturas" && modalInfo.id && (
                <GenericModal
                    onClose={() => setModalInfo({ tipo: null, id: null })}>
                    <Facturas id={modalInfo.id} />
                </GenericModal>
            )}
            
        </div>
    );
};
