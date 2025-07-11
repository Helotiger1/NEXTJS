import { CrudService } from "@/app/services/createCrudService";
import { useState } from "react";

export default function useCRUD<TData, TResult>(
  service: CrudService<TData, TResult>,
  key: keyof TResult,
  initState: TResult,
  updater: () => void
) {
  const [form, setForm] = useState<TResult | null>(null);

  const handleAgregar = () => {
    setForm(initState);
  };

  const handleEdit = (data: TResult) => {
    console.log(data);
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
    form,
    handleAgregar,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
  };
}
