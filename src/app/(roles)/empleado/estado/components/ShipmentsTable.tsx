"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { EditState } from "./EditState";
import { data, columns } from "../configs";
export const ShipmentsTable = () => {

    return <DynamicTable data={data} columns={columns} rowsPerPage={2}></DynamicTable>
};
