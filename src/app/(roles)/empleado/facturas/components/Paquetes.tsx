"use client";
import React from "react";
import DynamicCRUD from "@/app/(roles)/(shared)/components/CRUD/DynamicCRUD";
import { paqueteService, paquete } from "@/app/services/paqueteService";
import { formConfig, initState, getColumns } from "./configs";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";

export const Paquetes = () => {
    return (
        <>
            <DynamicCRUD<paquete>
                id={"cedula"}
                formConfig={formConfig}
                getColumns={getColumns}
                initState={initState}
                service={paqueteService}></DynamicCRUD>
        </>
    );
};
