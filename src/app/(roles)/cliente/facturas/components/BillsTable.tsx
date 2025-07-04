"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { data,columns } from "./configs";

export const BillsTable = () => {
    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
