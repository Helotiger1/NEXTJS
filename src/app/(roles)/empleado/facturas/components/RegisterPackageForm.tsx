import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { packageFormConfig,data, columns } from "../config";
import { CedulaFilter } from "@/app/(roles)/(shared)/components/filters/CedulaFilter";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";

import useBills from "../useBills";
import useForm from "@/app/(roles)/(shared)/hooks/useForm";


export function RegisterPackageForm() {

   const {handleAgregar, showForm, onSubmit, onCancel}= useForm();
    const {handleFactura} = useBills();


    if (showForm) {
        return (
            <DynamicForm
                config={packageFormConfig}
                onSubmit={onSubmit} onCancel={onCancel}></DynamicForm>
        );
    }

    return (
        <>
        <CedulaFilter></CedulaFilter>
            <GenericButton handleAction={handleAgregar} content="Agregar paquete" type="button"></GenericButton>
            <GenericButton handleAction={handleFactura} type="button" content="Generar factura"></GenericButton>
            <DynamicTable
                data={data}
                columns={columns}
                rowsPerPage={2}></DynamicTable>
        </>
    );
}
