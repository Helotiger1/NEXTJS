import { CrudService } from "@/app/services/createCrudService";
import { useState } from "react";

export default function useCRUD<TData, TResult>(
    service: CrudService<TData, TResult>,
    key: keyof TData,
    initState: TResult,
    updater: () => void,
    checks: boolean
) {
    const [array, setArray] = useState<TData[]>([]);

    const handleCheck = (row: TData, checked: boolean) => {
        setArray((prev) => {
            const exists = prev.some((item) => item[key] === row[key]);

            if (checked && !exists) {
                return [...prev, row];
            }

            if (!checked && exists) {
                return prev.filter((item) => item[key] !== row[key]);
            }

            return prev;
        });
    };

    const [form, setForm] = useState<TResult | null>(null);

    const handleAgregar = () => {
        setForm(initState);
    };

    const handleEdit = (data: TResult) => {
        setForm(data);
    };

    const handleCancel = () => {
        setForm(null);
    };

    const handleDelete = async (id: string) => {
        await service.eliminar(id);
        updater();
    };

    const handleSubmit = async (data: TResult) => {
        if (checks){
          const aux = {...data, paquetes: array};
          console.log(aux);
          await service.crear(aux);
          setArray([]);
        }

        if (form && form[key]) {
            await service.actualizar(String(form[key]), data);
            setForm(null);
            updater();
            return;
        }

        await service.crear(data);
        setForm(null);
        updater();
    };

    return {
        handleCheck,
        form,
        handleAgregar,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDelete, array
    };
}
