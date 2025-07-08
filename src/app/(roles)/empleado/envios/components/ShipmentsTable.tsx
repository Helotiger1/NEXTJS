"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { columns, data } from "../configs";

export const ShipmentsTable = () => {
    
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
