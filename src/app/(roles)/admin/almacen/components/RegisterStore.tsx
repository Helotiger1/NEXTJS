"use client"
import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { formConfig } from "../configs";
import { almacenService } from "@/app/services/almacenService";

export function RegisterStoreForm() {

    const onSubmit = async (data: any) => {
        const {telefono, ...direccion} = data;
        const Almacen = {telefono, direccion};
        await almacenService.crear(Almacen);
    }

    return <DynamicForm config={formConfig} onSubmit={onSubmit}></DynamicForm>;
}
