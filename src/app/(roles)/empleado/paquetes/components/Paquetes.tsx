"use client"
import DynamicCRUD from "@/app/(roles)/(shared)/components/CRUD/DynamicCRUD";
import React from "react";
import { formConfig, getColumns, initState } from "../configs";
import { paqueteService } from "@/app/services/paqueteService";
import { paquetePayload, paquete } from "@/app/services/paqueteService";
export const Paquetes = () => {
    return (
        <DynamicCRUD<paquete, paquetePayload>
            id={"tracking"}
            formConfig={formConfig}
            getColumns={getColumns}
            initState={initState}
            service={paqueteService} h1Name="Registre sus paquetes"
            formName="Rellene los datos correspondientes"
            name="Paquetes en registro"></DynamicCRUD>
    );
};
