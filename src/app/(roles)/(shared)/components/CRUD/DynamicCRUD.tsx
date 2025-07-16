"use client";
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
    id: keyof TData;
    initState: TResult;
    formConfig: Field[];
    getColumns: any;
    checks?: boolean;
    h1Name?: string;
    formName: string
}

export default function DynamicCRUD<
    TData extends Object,
    TResult extends Object = TData
>({
    h1Name, formName,
    service,
    id,
    initState,
    formConfig,
    getColumns,
    checks = false,
}: DynamicCRUDProps<TData, TResult>) {
    const { data, loading, error, updater } = useCRUDForm(service);

    const {
        form,
        handleAgregar,
        handleEdit,
        handleCancel,
        handleDelete,
        handleSubmit,
        array,
        handleCheck,
    } = useCRUD<TData, TResult>(service, id, initState, updater, checks);

    const columns = checks
        ? getColumns(handleCheck, array, id)
        : getColumns(handleDelete, handleEdit);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar</p>;
    console.log(data);

    if (checks) {
        return (
            <>
                <DynamicTable idName={id}
                    name={h1Name}
                    columns={columns}
                    data={data}></DynamicTable>
                <DynamicForm name={formName}
                    config={formConfig}
                    onSubmit={handleSubmit}></DynamicForm>
            </>
        );
    }

    if (form == null) {
        return (
            <>
                <DynamicTable idName={id}
                    name={h1Name}
                    columns={columns}
                    data={data}
                    rowsPerPage={8}>
                    {" "}
                    <GenericButton
                        handleAction={handleAgregar}
                        content="Agregar"
                        type="button"></GenericButton>
                </DynamicTable>
            </>
        );
    }

    if (form) {
        const initialConfig = form ?? initState;
        return (
            <DynamicForm name={formName}
                initConfig={initialConfig}
                config={formConfig}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        );
    }
}
