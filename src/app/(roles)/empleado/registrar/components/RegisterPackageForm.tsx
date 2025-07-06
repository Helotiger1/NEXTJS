import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { columns, data, packageFormConfig } from "../config";

import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { useState } from "react";

export function RegisterPackageForm() {
    const [meterPaquete, setMeterPaquete] = useState(false);

    const handleAgregar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMeterPaquete(true);
    };

    const onCancel = (e: React.MouseEvent<HTMLButtonElement> ) => {
        setMeterPaquete(false)
    };

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMeterPaquete(false);
    };

    const handleGenerarFactura = (e: React.MouseEvent<HTMLButtonElement>) => {
        //Logica de api, cuando exista.
    }
    
    if (meterPaquete) {
        return (
            <DynamicForm
                config={packageFormConfig}
                onSubmit={() => {}} onCancel={onCancel}></DynamicForm>
        );
    }

    return (
        <>
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-100 mb-2">
    Cedula a la que asociar factura
  </label>
  <input
    type="text"
    placeholder="Ej: 12345678"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  />
</div>
            <button
                type="button"
                onClick={handleAgregar}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                Agregar paquete
            </button>
            <button
                type="button"
                onClick={handleGenerarFactura}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                Generar factura.
            </button>
            <DynamicTable
                data={data}
                columns={columns}
                rowsPerPage={2}></DynamicTable>
        </>
    );
}
