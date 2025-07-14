import DynamicCRUD from "@/app/(roles)/(shared)/components/CRUD/DynamicCRUD";
import React from "react";
import { formConfig, getColumns, initState } from "../configs";
import { almacenService } from "@/app/services/almacenService";
import { almacen } from "@/app/services/almacenService";
export const Almacenes = () => {
    return (
        <DynamicCRUD<almacen>
            id={"codigo"}
            formConfig={formConfig}
            getColumns={getColumns}
            initState={initState}
            service={almacenService}></DynamicCRUD>
    );
};
