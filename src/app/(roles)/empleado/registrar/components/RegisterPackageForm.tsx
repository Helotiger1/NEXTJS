import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { packageFormConfig } from "../config";
import usePackageForm from "../usePackageForm";
import { CedulaFilter } from "@/app/(roles)/(shared)/components/filters/CedulaFilter";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";
import { data,columns } from "../config";
import useBills from "../useBills";


export function RegisterPackageForm() {

   const {handleAgregar, meterPaquete, onSubmit, onCancel}= usePackageForm();
    const {handleFactura} = useBills();


    if (meterPaquete) {
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
