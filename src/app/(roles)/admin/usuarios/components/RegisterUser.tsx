"use client"
import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { registerUserFormConfig } from "./configs";

export function RegisterUserForm() {

    return <DynamicForm config={registerUserFormConfig} onSubmit={() => {}}></DynamicForm>;
}
