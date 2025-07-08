"use client"
import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { registerUserFormConfig } from "./configs";
import { usuarioService } from "@/app/services/usuarioService";

export function RegisterUserForm() {
    const onSubmit = async (data : any) => {
        await usuarioService.crear(data);
    }
    return <DynamicForm config={registerUserFormConfig} onSubmit={onSubmit}></DynamicForm>;
}
