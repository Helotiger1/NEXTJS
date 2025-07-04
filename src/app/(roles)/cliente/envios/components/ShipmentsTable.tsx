"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { data,columns } from "../configs";
export const ShipmentsTable = () => {

    return <><div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Buscar envíos de paquete por tracking
  </label>
  <input
    type="text"
    placeholder="Ej: TRK-1002"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  />
</div>
<DynamicTable data={data} columns={columns} rowsPerPage={4}></DynamicTable></>
};
