"use client"
import React from "react";
import useCRUD from "../../hooks/useForm";
import { useCRUDForm } from "../../hooks/useCRUDForm";
import { CrudService } from "@/app/services/createCrudService";
import DynamicForm from "../forms/DynamicForm";
import DynamicTable from "../tables/DynamicTable";
import { GenericButton } from "../buttons/GenericButton";
import { Field } from "../forms/types";

interface DynamicCRUDProps<TData extends Object, TResult extends Object> {
    service: CrudService<TData, TResult>;
    id: keyof TResult;
    initState: TResult;
    formConfig: Field[];
    getColumns: any;
    checks?: boolean
}

export default function DynamicCRUD<TData extends Object, TResult extends Object = TData >({
    service,
    id,
    initState,
    formConfig,
    getColumns, checks = false
}: DynamicCRUDProps<TData, TResult>) {
    const { data, loading, error, updater } = useCRUDForm(service);

    const {
        form,
        handleAgregar,
        handleEdit,
        handleCancel,
        handleDelete,
        handleSubmit, array, handleCheck
    } = useCRUD<TData, TResult>(service, id, initState, updater, checks);
    
    const columns = checks? getColumns(handleDelete, handleEdit) : getColumns(handleCheck, array, id);

    
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    console.log(data)
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
