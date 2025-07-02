"use client"
import DynamicForm, {
    Field,
} from "@/app/(roles)/(shared)/components/forms/DynamicForm";

export function RegisterStoreForm() {
    const formConfig: Field[] = [
        {
            name: "1",
            label: "Linea 1",
            type: "text",
        },
        {
            name: "2",
            label: "Linea 2",
            type: "text",
        },
        {
            name: "3",
            label: "Pais",
            type: "text",
        },
        {
            name: "4",
            label: "Estado",
            type: "text",
        },
        {
            name: "5",
            label: "Ciudad",
            type: "text",
        },
        {
            name: "6",
            label: "Codigo Postal",
            type: "text",
        },
        
    ];

    return <DynamicForm config={formConfig} onSubmit={() => {}}></DynamicForm>;
}
