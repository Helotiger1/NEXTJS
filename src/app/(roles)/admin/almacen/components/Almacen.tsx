"use client";
import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { formConfig } from "../configs";
import { almacenService } from "@/app/services/almacenService";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { columns} from "../configs";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";
import useForm from "@/app/(roles)/(shared)/hooks/useForm";
import { useAlmacenes } from "./use";

export function Almacen() {
     const {handleAgregar, showForm, onCancel, onSubmit}= useForm();
    const {data, loading, error  } = useAlmacenes();
     if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar</p>;

  const plano = data.map((almacen: any) => {
          const { direccion, ...resto } = almacen;
          return {
            ...resto,
            ...direccion,
          };
        });

    console.log(plano)

     const handleSubmit = async (data: any) => {
        const { telefono, ...direccion } = data;
        const Almacen = { telefono, direccion };
        await almacenService.crear(Almacen);
        onSubmit();
    };
    
    if (showForm) {
        return (
            <DynamicForm config={formConfig} onCancel={onCancel} onSubmit={handleSubmit}></DynamicForm>
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
