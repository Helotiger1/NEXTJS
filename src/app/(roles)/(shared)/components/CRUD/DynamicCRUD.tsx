"use client"
import React from "react";
import useCRUD from "../../hooks/useForm";
import { useCRUDForm } from "../../hooks/useCRUDForm";
import { CrudService } from "@/app/services/createCrudService";
import DynamicForm from "../forms/DynamicForm";
import DynamicTable from "../tables/DynamicTable";
import { GenericButton } from "../buttons/GenericButton";
import { Field } from "../forms/types";

interface DynamicCRUDProps<TData, TResult extends Object> {
    service: CrudService<TData, TResult>;
    key: keyof TResult;
    initState: TResult;
    formConfig: Field[];
    getColumns: (
        handleDelete: (id: string) => void,
        handleEdit: (data : TResult) => void
    ) => any;
}

export default function DynamicCRUD<TData, TResult extends Object>({
    service,
    key,
    initState,
    formConfig,
    getColumns,
}: DynamicCRUDProps<TData, TResult>) {
    const { data, loading, error, updater } = useCRUDForm(service);

    const {
        form,
        handleAgregar,
        handleEdit,
        handleCancel,
        handleDelete,
        handleSubmit,
    } = useCRUD<TData, TResult>(service, key, initState, updater);

    const columns = getColumns(handleDelete, handleEdit);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    if (form == null) {
        return (
            <>
                <GenericButton
                    handleAction={handleAgregar}
                    content="Agregar"
                    type="button"></GenericButton>
                <DynamicTable
                    columns={columns}
                    data={data}
                    rowsPerPage={2}></DynamicTable>
            </>
        );
    }

    if (form) {
const initialConfig = form ?? initState;
        return (
            <DynamicForm
                initConfig={initialConfig}
                config={formConfig}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        );
    }
}
