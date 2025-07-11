import DynamicCRUD from "@/app/(roles)/(shared)/components/CRUD/DynamicCRUD";
import React from "react";
import { formConfig, getColumns, initState } from "../configs";
import { almacenService } from "@/app/services/almacenService";
import { almacenPlano, almacen } from "@/app/services/almacenService";
export const Almacenes = () => {
    return (
        <DynamicCRUD<almacen, almacenPlano>
            key={"codigo"}
            formConfig={formConfig}
            getColumns={getColumns}
            initState={initState}
            service={almacenService}></DynamicCRUD>
    );
};
