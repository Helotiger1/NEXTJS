"use client";
import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { formConfig } from "../configs";
import { type Almacen, almacenService } from "@/app/services/almacenService";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { getColumns } from "../configs";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";
import useForm from "@/app/(roles)/(shared)/hooks/useForm";
import { useAlmacenes } from "./use";

export function Almacen() {
    const {
        handleAgregar,
        showForm,
        onCancel,
        onSubmit,
        handleCancelEdit,
        handleEdit,
        editingRow,
    } = useForm();

    const { data, loading, error, updater } = useAlmacenes();

    const columns = getColumns(updater, handleEdit);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;

    const plano = data.map((almacen: any) => {
        const { direccion, ...resto } = almacen;
        return {
            ...resto,
            ...direccion,
        };
    });

    const handleSubmit = async (data: any) => {
        const { telefono, ...direccion } = data;
        const Almacen = { telefono, direccion } as Almacen;
        await almacenService.crear(Almacen);
        onSubmit();
        updater();
    };

    if (editingRow) {
        return (
            <DynamicForm
                initConfig={editingRow}
                config={formConfig}
                onCancel={handleCancelEdit}
                onSubmit={async (data: any) =>{
                    console.log(data);
                      const payload = {data.telefono, direccion: {...data,};
                    await almacenService.actualizar(editingRow.codigo, data);
                    updater();
                }
                }></DynamicForm>
        );
    }

    if (showForm) {
        return (
            <DynamicForm
                config={formConfig}
                onCancel={onCancel}
                onSubmit={handleSubmit}></DynamicForm>
        );
    }

    return (
        <>
            <GenericButton
                handleAction={handleAgregar}
                content="Agregar paquete"
                type="button"></GenericButton>{" "}
            <DynamicTable
                columns={columns}
                data={plano}
                rowsPerPage={4}></DynamicTable>
        </>
    );
}
