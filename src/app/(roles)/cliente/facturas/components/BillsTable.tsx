"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import { data,columns } from "./configs";
import SectionHeader from "../../envios/components/SearchForTracking";

export const BillsTable = () => {

    return<><DynamicTable data={data} columns={columns} rowsPerPage={2}><SectionHeader name="WAo"></SectionHeader></DynamicTable></>
};
